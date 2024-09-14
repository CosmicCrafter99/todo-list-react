import { useState, useEffect } from 'react';
import axios from 'axios';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import './App.css';

const API_URL = 'http://localhost:3001/api/todos'; // URL для API

/**
 * Главный компонент приложения с подключением к серверу
 * @component
 * @returns {JSX.Element}
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [userId, setUserId] = useState('');

  // Input field to update userId
  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
  };

  // Получение задач с сервера
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/${userId}`);
        setTasks(res.data);
      } catch (err) {
        console.log('Ошибка при получении задач:', err);
      }
    };
    fetchTasks();
  }, [userId]);

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>To Do List</h1>
      </header>
      <input
        type="text"
        value={userId}
        onChange={handleUserIdChange}
        placeholder="Enter User ID"
      />
      <TodoForm addTask={addTask} />
      <TodoList tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} saveTask={saveTask} />
    </div>
  );
}

export default App;