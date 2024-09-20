import { useState } from 'react';
import PropTypes from 'prop-types';
import './TodoForm.css';

/**
 * Компонент формы для добавления новой задачи.
 * @param {Object} props - Свойства компонента.
 * @param {function(string): void} props.addTask - Функция для добавления новой задачи.
 * @returns {JSX.Element} Компонент TodoForm.
 */
function TodoForm({ addTask }) {
    const [task, setTask] = useState('');
    const [taskDeadline, setTaskDeadline] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            addTask(task, taskDeadline);
            setTask('');
            setTaskDeadline('');
        }
    };

    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    return (
        <form onSubmit={handleSubmit} className='todo-form'>
            <input
                type="text"
                placeholder="Add a new task..."
                className="task-input"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
                className="task-input"
                min={getTodayDate()}
            />
            <button className='add-task-button'>Add Task</button>
        </form>
    );
}

TodoForm.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default TodoForm;