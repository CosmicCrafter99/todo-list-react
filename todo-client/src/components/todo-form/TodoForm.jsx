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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task.trim()) {
            addTask(task);
            setTask('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className='task-input'>
            <input type="text" placeholder="Add a new task..." value={task} onChange={(e) => setTask(e.target.value)} />
            <button onClick={addTask}>Add Task</button>
        </form>
    );
}

TodoForm.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default TodoForm;