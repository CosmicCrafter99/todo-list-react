import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './components/todo-form/TodoForm';
import TodoList from './components/todo-list/TodoList';
import TodoFilter from './components/todo-filter/TodoFilter';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL; // URL для API

/**
 * Главный компонент приложения с подключением к серверу
 * @component
 * @returns {JSX.Element}
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeFilter, setActiveFilter] = useState(false);

  // Input field to update userId
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  // Получение задач с сервера
  const fetchTasks = async (filter) => {
    try {
      const res = await axios.get(`${API_URL}/${userId}`, {
        params: { filter }
      });
      setTasks(res.data);
    } catch (err) {
      console.log('Ошибка при получении задач:', err);
    }
  };

  // Добавление новой задачи
  const addTask = async (taskText) => {
    try {
      console.log('userId:', userId, 'taskText:', taskText);
      const res = await axios.post(API_URL, { text: taskText, userId });
      setTasks([...tasks, res.data]);
    } catch (err) {
      console.log('Ошибка при добавлении задачи:', err);
    }
  };

  // Обновление статуса задачи
  const toggleComplete = async (id) => {
    const task = tasks.find(t => t._id === id);
    try {
      const res = await axios.put(`${API_URL}/${id}/status`, { completed: !task.completed });
      setTasks(tasks.map(t => t._id === id ? res.data : t));
    } catch (err) {
      console.log('Ошибка при обновлении задачи:', err);
    }
  };

  // Удаление задачи
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.log('Ошибка при удалении задачи:', err);
    }
  }

  // Сохранение измененной задачи
  const saveTask = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}/text`, { text: task.text });
      setTasks(tasks.map(t => t._id === task._id ? task : t));
    } catch (err) {
      console.log('Ошибка при сохранении задачи:', err);
    }
  };

  const handleConnect = () => {
    fetchTasks(filter);
    setActiveFilter(true);
  };

  useEffect(() => {
    if (userId) {
      fetchTasks(filter);
    }
  }, [filter]);

  useEffect(() => {
    if (!userId) {
      setActiveFilter(false);
      setTasks([]);
    }
  }, [userId]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>To Do List</h1>
      </header>
      <div className="input-container-wrapper">
        <div className="input-container">
          <input
            type="text"
            value={userId}
            onChange={handleUserIdChange}
            placeholder="Enter User ID"
            className="user-id-input"
          />
          {userId && (
            <button className="clear-button" onClick={() => setUserId('')}>
              &times;
            </button>
          )}
        </div>
        <button className="connect-button" onClick={handleConnect}>Connect</button>
      </div>
      {activeFilter && <TodoFilter filter={filter} setFilter={setFilter} />}
      <TodoForm addTask={addTask} />
      {tasks.length > 0 && <TodoList tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} saveTask={saveTask} />}
    </div>
  );
}

export default App;