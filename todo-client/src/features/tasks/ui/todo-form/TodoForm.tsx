import { useState, FormEvent } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import './TodoForm.css';
import Button from '../../../../shared/ui/button/Button';
import { getIsDeadlineOverdue } from '../../../../shared/lib/getIsDeadlineOverdue';
import { formatDeadline } from '../../../../shared/lib/formatDeadline';
import { Input } from '../../../../shared/ui/input/Input';
import { Task } from '../../../../shared/types/task';

interface TodoFormProps {
    addTask: (task: Omit<Task, '_id' | 'order' | 'userId' | 'completed'>) => void;
}

/**
 * Компонент формы для добавления новой задачи.
 * @param {TodoFormProps} props - Свойства компонента.
 * @returns {JSX.Element} Компонент TodoForm.
 */
const TodoForm: React.FC<TodoFormProps> = ({ addTask }) => {
    const [text, setText] = useState('');
    const [description, setDescription] = useState('');
    const [deadlineDate, setDeadlineDate] = useState('');
    const [deadlineTime, setDeadlineTime] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!text.trim()) {
            enqueueSnackbar('Task text cannot be empty', { variant: 'error' });
            return;
        }

        const formatedDeadline = formatDeadline(deadlineDate, deadlineTime);

        if (formatedDeadline) {
            const isDeadlineOverdue = formatedDeadline ? getIsDeadlineOverdue(formatedDeadline) : false;

            if (isDeadlineOverdue) {
                enqueueSnackbar('Cannot set a deadline in the past', { variant: 'error' });
                return;
            }
        }

        addTask({ text, deadline: formatedDeadline, description });
        setText('');
        setDescription('');
        setDeadlineDate('');
        setDeadlineTime('');
    };

    const getTodayDateTime = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return {
            date: `${year}-${month}-${day}`,
        };
    };

    const { date: minDate } = getTodayDateTime();

    return (
        <form className="todo-form" onSubmit={handleSubmit}>
            <h2 className='task-form-title'>Add Task</h2>
            <Input
                type={"text"}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Add a new task..."}
                className="todo-input"
                size={'l'}
            />
            <Input
                type={"textarea"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={"Add a description..."}
                className="todo-input"
                rows={3}
                size={'l'}
            />
            <Input
                type={"date"}
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                placeholder={"Add a deadline date..."}
                className="todo-input"
                min={minDate}
                size={'l'}
            />
            <Input
                type={"time"}
                value={deadlineTime}
                onChange={(e) => setDeadlineTime(e.target.value)}
                placeholder={"Add a deadline time..."}
                className="todo-input"
                size={'l'}
            />
            <Button type="submit" className='todo-button'>Add Task</Button>
        </form>
    );
};

TodoForm.propTypes = {
    addTask: PropTypes.func.isRequired,
};

export default TodoForm;