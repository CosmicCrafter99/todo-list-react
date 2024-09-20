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
      enqueueSnackbar('Ошибка при получении задач! Попробуйте чуть позже', { variant: 'error' });
    }
  };

  // Добавление новой задачи
  const addTask = async (taskText, deadline) => {
    const minOrder = tasks.length > 0 ? Math.min(...tasks.map(task => task.order)) : 0;
    const newTask = {
      text: taskText,
      completed: false,
      order: minOrder - 1,
      userId: user.uid,
      deadline: deadline || null // Добавление дедлайна
    };
    try {
      const res = await axios.post(API_URL, newTask);
      setTasks([res.data, ...tasks]);
      enqueueSnackbar('Задача добавлена', { variant: 'success' });
    } catch (err) {
      console.log('Ошибка при добавлении задачи:', err);
      enqueueSnackbar('Ошибка! Попробуйте чуть позже', { variant: 'error' });
    }
  };

  // Обновление статуса задачи
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      const res = await axios.put(`${API_URL}/${id}/status`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
      if (!task.completed) {
        enqueueSnackbar('Задача завершена', { variant: 'success' });
      } else {
        enqueueSnackbar('Задача восстановлена', { variant: 'info' });
      }
    } catch (err) {
      console.log('Ошибка при обновлении задачи:', err);
      enqueueSnackbar('Ошибка! Попробуйте чуть позже', { variant: 'error' });
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      enqueueSnackbar('Задача удалена', { variant: 'error' });
    } catch (err) {
      console.log('Ошибка при удалении задачи:', err);
      enqueueSnackbar('Ошибка! Попробуйте чуть позже', { variant: 'error' });
    }
  };

  // Сохранение измененной задачи
  const saveTask = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}/text`, { text: task.text });
      setTasks(tasks.map(t => t._id === task._id ? task : t));
      enqueueSnackbar('Задача изменена', { variant: 'info' });
    } catch (err) {
      console.log('Ошибка при сохранении задачи:', err);
      enqueueSnackbar('Ошибка! Попробуйте чуть позже', { variant: 'error' });
    }
  };

  // Обновление порядка задач
  const updateTaskOrder = async (newTasks) => {
    setTasks([...newTasks, ...completeTasks]);
    try {
      await axios.put(`${API_URL}/${user.uid}/order`, { tasks: newTasks });
      enqueueSnackbar('Порядок задач обновлен', { variant: 'info' });
    } catch (err) {
      console.log('Ошибка при обновлении порядка задач:', err);
      enqueueSnackbar('Ошибка! Попробуйте чуть позже', { variant: 'error' });
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
        {user && <button className="logout-button" onClick={handleSignOut}>Выйти</button>}
      </header>
      {
        user ? (
          <>
            <TodoFilter filter={filter} setFilter={setFilter} />
            <TodoForm addTask={(text, date) => addTask(text, date)} />
            {tasks.length > 0 && (
              <>
                <TodoList tasks={incompleteTasks} toggleComplete={toggleComplete} deleteTask={deleteTask} saveTask={saveTask} updateTaskOrder={updateTaskOrder} />
                {filter !== 'incomplete' && <h2>Завершенные задачи</h2>}
                <TodoList tasks={completeTasks} toggleComplete={toggleComplete} deleteTask={deleteTask} saveTask={saveTask} updateTaskOrder={() => { }} />
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