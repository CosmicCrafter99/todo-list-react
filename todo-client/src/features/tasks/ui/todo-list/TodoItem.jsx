import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import './TodoItem.css';
import IconButton from '../../../../shared/ui/icon-button/IconButton';
import { getIsDeadlineOverdue } from '../../../../shared/lib/getIsDeadlineOverdue';
import { formatDeadline } from '../../../../shared/lib/formatDeadline';
import { Input } from '../../../../shared/ui/input/Input';

/**
 * Компонент отдельной задачи.
 * @param {Object} props - Свойства компонента.
 * @param {Object} props.task - Задача.
 * @param {number} props.task._id - ID задачи.
 * @param {string} props.task.text - Текст задачи.
 * @param {boolean} props.task.completed - Состояние завершенности задачи.
 * @param {function(number): void} props.deleteTask - Функция для удаления задачи.
 * @param {function(): void} props.updateTask - Функция для сохранения задачи.
 * @returns {JSX.Element} Компонент TodoItem.
 */
const TodoItem = ({ task, deleteTask, updateTask }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(task.text);
    const [editedDescription, setEditedDescription] = useState(task.description || '');
    const [editedDeadline, setEditedDeadline] = useState(task.deadline ? task.deadline.split('T')[0] : '');
    const [editedTime, setEditedTime] = useState(task.deadline && task.deadline.includes('T') ? task.deadline.split('T')[1].slice(0, 5) : '');
    const textareaRef = useRef(null);
    const descriptionRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [isEditing, editedText]);

    useEffect(() => {
        if (isEditing && descriptionRef.current) {
            descriptionRef.current.style.height = 'auto';
            descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`;
        }
    }, [isEditing, editedDescription]);

    const handleCheckboxChange = () => {
        updateTask({ ...task, completed: !task.completed });
    };

    const handleSave = () => {
        const formatedDeadline = formatDeadline(editedDeadline, editedTime);
        const isDeadlineOverdue = formatedDeadline ? getIsDeadlineOverdue(formatedDeadline) : false;

        if (isDeadlineOverdue) {
            enqueueSnackbar('Cannot set a deadline in the past', { variant: 'error' });
            return;
        }

        updateTask({ ...task, text: editedText, description: editedDescription, deadline: formatedDeadline });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedText(task.text);
        setEditedDescription(task.description || '');
        setEditedDeadline(task.deadline ? task.deadline?.split('T')[0] : '');
        setEditedTime(task.deadline && task.deadline.includes('T') ? task.deadline.split('T')[1].slice(0, 5) : '');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(`${task.text} ${task.description || ''}`).then(() => {
            console.log('Task text copied to clipboard');
            enqueueSnackbar('Task text copied to clipboard', { variant: 'success' });
        }).catch(err => {
            console.log('Error copying text:', err);
            enqueueSnackbar('Error copying text! Please try again', {
                variant: 'error'
            });
        });
    };

    const getTodayDateTime = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const hours = String(today.getHours()).padStart(2, '0');
        const minutes = String(today.getMinutes()).padStart(2, '0');
        return {
            date: `${year}-${month}-${day}`,
            time: `${hours}:${minutes}`
        };
    };

    const { date: minDate, time: minTime } = getTodayDateTime();
    const isDeadlineOverdue = task.deadline ? getIsDeadlineOverdue(task.deadline) : false;

    return (
        <li className={`todo-item ${task.completed ? 'completed' : ''}`}>
            <div className="left-section">
                {isEditing ? (
                    <div className="edit-section">
                        <Input
                            value={editedText}
                            onChange={(e) => setEditedText(e.target.value)}
                            className="edit-input"
                            placeholder='Add a task...'
                            ref={textareaRef}
                            rows="1"
                        />
                        <Input
                            type="textarea"
                            ref={descriptionRef}
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="edit-input"
                            placeholder='Add a description...'
                            rows="3"
                        />
                        <Input
                            type="date"
                            value={editedDeadline}
                            onChange={(e) => setEditedDeadline(e.target.value)}
                            className="edit-input"
                            placeholder='Add a deadline date...'
                            min={minDate}
                        />
                        <Input
                            type="time"
                            value={editedTime}
                            onChange={(e) => setEditedTime(e.target.value)}
                            className="edit-input"
                            placeholder='Add a deadline time...'
                            min={editedDeadline === minDate ? minTime : ''}
                        />
                    </div>
                ) : (
                    <>
                        <Input
                            type="checkbox"
                            checked={task.completed}
                            onChange={handleCheckboxChange}
                            className='task-checkbox'
                        />
                        <div className="task-details">
                            <span className={`task-text`}>{task.text}</span>
                            {task.description && (
                                <span className="task-description">{task.description}</span>
                            )}
                            {task.deadline && (
                                <span className={`task-deadline ${isDeadlineOverdue && !task.completed ? 'overdue' : ''}`}>
                                    Deadline: {task.deadline.includes('T') ? new Date(task.deadline).toLocaleString() : new Date(task.deadline).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
            <div className='buttons-block'>
                {isEditing ? (
                    <>
                        <IconButton onClick={handleSave} title="Save" icon="fas fa-check" />
                        <IconButton onClick={() => setIsEditing(false)} title="Cancel" icon="fas fa-times" />
                    </>
                ) : (
                    <>
                        <IconButton onClick={handleCopy} title="Copy" icon="fas fa-copy" />
                        {
                            !task.completed && <IconButton onClick={handleEdit} title="Edit" icon="fas fa-edit" />
                        }
                        <IconButton onClick={() => deleteTask(task._id)} title="Delete" icon="fas fa-trash" />
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
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
};

export default TodoItem;