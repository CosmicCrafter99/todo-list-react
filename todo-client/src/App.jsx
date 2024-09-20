import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import TodoForm from './components/todo-form/TodoForm';
import TodoList from './components/todo-list/TodoList';
import TodoFilter from './components/todo-filter/TodoFilter';
import { auth } from './firebase';
import './App.css';
import Home from './components/home/Home';

const API_URL = import.meta.env.VITE_API_URL; // URL для API

/**
 * Главный компонент приложения с подключением к серверу
 * @component
 * @returns {JSX.Element}
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [user, setUser] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, filter]);

  // Получение задач с сервера
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/${user.uid}`, {
        params: { filter }
      });
      const sortedTasks = res.data.sort((a, b) => a.order - b.order); // Сортировка задач по полю order
      setTasks(sortedTasks);
    } catch (err) {
      console.log('Ошибка при получении задач:', err);
      enqueueSnackbar('Error fetching tasks! Please try again later', { variant: 'error' });
    }
  };

  // Добавление новой задачи
  const addTask = async (taskParams) => {
    const minOrder = tasks.length > 0 ? Math.min(...tasks.map(task => task.order)) : 0;
    const newTask = {
      ...taskParams,
      completed: false,
      order: minOrder - 1,
      userId: user.uid,
    };
    try {
      const res = await axios.post(API_URL, newTask);
      setTasks([res.data, ...tasks]);
      enqueueSnackbar('Task added', { variant: 'success' });
    } catch (err) {
      console.log('Ошибка при добавлении задачи:', err);
      enqueueSnackbar('Error! Please try again later', { variant: 'error' });
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      enqueueSnackbar('Task deleted', { variant: 'error' });
    } catch (err) {
      console.log('Ошибка при удалении задачи:', err);
      enqueueSnackbar('Error! Please try again later', { variant: 'error' });
    }
  };

  // Сохранение измененной задачи
  const updateTask = async (updatedTask) => {
    try {
      const res = await axios.put(`${API_URL}/${updatedTask._id}`, updatedTask);
      const newTasks = tasks.map(t => t._id === updatedTask._id ? res.data : t);
      setTasks(newTasks);

      const originalTask = tasks.find(t => t._id === updatedTask._id);
      if (updatedTask.completed !== undefined && originalTask.completed !== updatedTask.completed) {
        const message = updatedTask.completed ? 'Task completed' : 'Task restored';
        const variant = updatedTask.completed ? 'success' : 'info';
        enqueueSnackbar(message, { variant });
      } else {
        enqueueSnackbar('Task updated', { variant: 'success' });
      }
    } catch (err) {
      console.log('Error updating task:', err);
      enqueueSnackbar('Error! Please try again later', { variant: 'error' });
    }
  };

  // Обновление порядка задач
  const updateTaskOrder = async (newTasks) => {
    setTasks([...newTasks, ...completeTasks]);
    try {
      await axios.put(`${API_URL}/${user.uid}/order`, { tasks: newTasks });
      enqueueSnackbar('Task order updated', { variant: 'info' });
    } catch (err) {
      console.log('Ошибка при обновлении порядка задач:', err);
      enqueueSnackbar('Error! Please try again later', { variant: 'error' });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null); // Сбросьте состояние пользователя
  };

  // Разделение задач на завершенные и незавершенные
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completeTasks = tasks.filter(task => task.completed);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className='header-title'>To Do List</h1>
        {user && <button className="logout-button" onClick={handleSignOut}>Sign out</button>}
      </header>
      {
        user ? (
          <>
            <TodoFilter filter={filter} setFilter={setFilter} />
            <TodoForm addTask={(text, date) => addTask(text, date)} />
            {tasks.length > 0 && (
              <>
                <TodoList tasks={incompleteTasks} updateTask={updateTask} deleteTask={deleteTask} updateTaskOrder={updateTaskOrder} />
                {filter !== 'incomplete' && <h2>Completed tasks</h2>}
                <TodoList tasks={completeTasks} updateTask={updateTask} deleteTask={deleteTask} updateTaskOrder={() => { }} />
              </>
            )}
          </>
        ) : (
          <Home />
        )
      }
    </div>
  );
}

export default App;