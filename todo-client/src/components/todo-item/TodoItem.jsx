import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
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
const TodoItem = ({ task, toggleComplete, deleteTask, saveTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);
    const [editedDeadline, setEditedDeadline] = useState(task.deadline);
    const textareaRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isEditing, editedText]);

    const handleCheckboxChange = () => {
        toggleComplete(task._id);
    };

    const getTodayDate = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleSave = () => {
        saveTask({ ...task, text: editedText, deadline: editedDeadline });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedText(task.text);
        setEditedDeadline(task.deadline);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(task.text).then(() => {
            console.log('Текст задачи скопирован в буфер обмена');
            enqueueSnackbar('Текст задачи скопирован в буфер обмена', { variant: 'success' });
        }).catch(err => {
            console.log('Ошибка при копировании текста:', err);
            enqueueSnackbar('Ошибка при копировании текста! Попробуйте еще раз', {
                variant: 'error'
            });
        });
    };

    const isDeadlineOverdue = task.deadline && new Date(task.deadline) < new Date();

    return (
        <li className={`todo-item ${task.completed ? 'completed' : ''}`}>
            <div className="left-section">
                {isEditing ? (
                    <div className="edit-section">
                        <textarea
                            ref={textareaRef}
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="edit-input"
                            rows="1"
                        />
                        <input
                            type="date"
                            value={editedDeadline ? editedDeadline.split('T')[0] : ''}
                            onChange={(e) => setEditedDeadline(e.target.value)}
                            className="edit-input"
                            min={getTodayDate()}
                        />
                    </div>
                ) : (
                    <>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={handleCheckboxChange}
                            className='task-checkbox'
                        />

                        <div className="task-details">
                            <span className='task-text'>{task.text}</span>
                            {task.deadline && (
                                <span className={`task-deadline ${isDeadlineOverdue ? 'overdue' : ''}`}>
                                    Дедлайн: {new Date(task.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className='buttons-block'>
                {isEditing ? (
                    <>
                        <button onClick={handleSave} title="Сохранить"><i className="fas fa-check"></i></button>
                        <button onClick={() => setIsEditing(false)} title="Отменить"><i className="fas fa-times"></i></button>
                    </>
                ) : (
                    <>
                        <button onClick={handleCopy} title="Копировать"><i className="fas fa-copy"></i></button>
                        {!task.completed && <button onClick={handleEdit} title="Редактировать"><i className="fas fa-edit"></i></button>}
                        <button onClick={() => deleteTask(task._id)} title="Удалить"><i className="fas fa-trash"></i></button>
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
        deadline: PropTypes.string,
    }).isRequired,
    toggleComplete: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired,
};

export default TodoItem;