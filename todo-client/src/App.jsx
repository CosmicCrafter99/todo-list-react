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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadlineFilter, setDeadlineFilter] = useState('all-time');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Получение задач с сервера
  useEffect(() => {
    if (user) {
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

      fetchTasks();
    }
  }, [user, filter]);

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
    } finally {
      setIsModalOpen(false);
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

        // Обновление порядка задач
        let incompleteTasks = newTasks.filter(task => !task.completed);
        let completeTasks = newTasks.filter(task => task.completed);
        if (updatedTask.completed) {
          completeTasks = [res.data, ...completeTasks.filter(task => task._id !== updatedTask._id)];
        } else {
          incompleteTasks = [res.data, ...incompleteTasks.filter(task => task._id !== updatedTask._id)];
        }
        await updateTaskOrder([...incompleteTasks, ...completeTasks]);
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
    setTasks(newTasks);
    try {
      await axios.put(`${API_URL}/${user.uid}/order`, { tasks: newTasks });
    } catch (err) {
      console.log('Ошибка при обновлении порядка задач:', err);
      enqueueSnackbar('Error! Please try again later', { variant: 'error' });
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null); // Сбросьте состояние пользователя
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Фильтрация задач по статусу и дедлайну
  const filterTasks = (tasks) => {
    let filteredTasks = tasks;

    if (filter !== 'all') {
      filteredTasks = filteredTasks.filter(task => filter === 'completed' ? task.completed : !task.completed);
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Начало и конец текущей недели
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Понедельник текущей недели
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7); // Воскресенье текущей недели

    // Начало и конец следующей недели
    const startOfNextWeek = new Date(endOfWeek);
    startOfNextWeek.setDate(endOfWeek.getDate()); // Понедельник следующей недели
    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 7); // Воскресенье следующей недели

    switch (deadlineFilter) {
      case 'today':
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate.toDateString() === today.toDateString();
        });
        break;
      case 'tomorrow':
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate.toDateString() === tomorrow.toDateString();
        });
        break;
      case 'this-week':
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfWeek && taskDate <= endOfWeek;
        });
        break;
      case 'next-week':
        filteredTasks = filteredTasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfNextWeek && taskDate <= endOfNextWeek;
        });
        break;
      default:
        break;
    }

    if (deadlineFilter !== 'all-time') {
      // Сортировка по возрастанию дедлайна
      filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }

    return filteredTasks;
  };

  const filteredTasks = filterTasks(tasks);

  // Разделение задач на завершенные и незавершенные
  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completeTasks = filteredTasks.filter(task => task.completed);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className='header-title'>To Do List</h1>
        {user && <button className="logout-button" onClick={handleSignOut}>Sign out</button>}
      </header>
      {
        user ? (
          <>
            <div className="filter-add-task-container">
              <TodoFilter filter={filter} setFilter={setFilter} deadlineFilter={deadlineFilter} setDeadlineFilter={setDeadlineFilter} />
              <button className="add-task-button" onClick={toggleModal}>
                <strong>+</strong> Add task
              </button>
            </div>

            {tasks.length > 0 && (
              <>
                <TodoList tasks={incompleteTasks} updateTask={updateTask} deleteTask={deleteTask} updateTaskOrder={(tasks) => updateTaskOrder([...tasks, ...completeTasks])} />
                {filter !== 'incomplete' && <h2>Completed tasks</h2>}
                <TodoList tasks={completeTasks} updateTask={updateTask} deleteTask={deleteTask} updateTaskOrder={() => { }} />
              </>
            )}
          </>
        ) : (
          <Home />
        )
      }
      {isModalOpen && (
        <div className="task-modal-overlay">
          <div className="task-modal">
            <span className="task-close-button" onClick={toggleModal}>&times;</span>
            <TodoForm addTask={addTask} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;