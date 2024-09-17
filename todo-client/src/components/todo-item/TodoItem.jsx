import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './TodoItem.css';

/**
 * Компонент отдельной задачи.
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.task - Задача.
 * @param {number} props.task._id - ID задачи.
 * @param {string} props.task.text - Текст задачи.
 * @param {boolean} props.task.completed - Состояние завершенности задачи.
 * @param {function(number): void} props.toggleComplete - Функция для переключения состояния завершенности задачи.
 * @param {function(number): void} props.deleteTask - Функция для удаления задачи.
 * @param {function(): void} props.saveTask - Функция для сохранения задачи.
 * @returns {JSX.Element} Компонент TodoItem.
 */
function TodoItem({ task, toggleComplete, deleteTask, saveTask }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);

    const handleCheckboxChange = () => {
        toggleComplete(task._id);
    };

    const handleSave = () => {
        saveTask({ ...task, text: editedText });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedText(task.text);
    }

    return (
        <li className={`task-item ${task.completed ? 'completed' : ''}`}>
            <input
                type="checkbox"
                checked={task.completed}
                onChange={handleCheckboxChange}
            />
            {isEditing ? (
                <input
                    type="text"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                />
            ) : (
                <span>{task.text}</span>
            )}
            <div className='buttons-block'>
                {isEditing ? (
                    <>
                        <button onClick={handleSave}><i className="fas fa-check"></i></button>
                        <button onClick={() => setIsEditing(false)}><i className="fas fa-times"></i></button>
                    </>
                ) : (
                    <>
                        {!task.completed && <button onClick={handleEdit}><i className="fas fa-edit"></i></button>}
                        <button onClick={() => deleteTask(task._id)}><i className="fas fa-trash"></i></button>
                    </>
                )}
            </div>
        </li>
    );
}

TodoItem.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired,
    }).isRequired,
    toggleComplete: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired,
};

export default TodoItem;