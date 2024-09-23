import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import TodoFilter from '../../features/tasks/ui/todo-filter/TodoFilter';
import Button from '../../shared/ui/button/Button';
import TodoList from '../../features/tasks/ui/todo-list/TodoList';
import { deleteTask } from '../../shared/api/deleteTask';
import { putTask } from '../../shared/api/putTask';
import { putOrder } from '../../shared/api/putOrder';
import { getTasks } from '../../shared/api/getTasks';
import { postTask } from '../../shared/api/postTask';
import { useAuth } from '../../features/auth/model/AuthContext';
import { filterTasks } from '../../shared/lib/filterTasks';
import Modal from '../../shared/ui/modal/Modal';
import TodoForm from '../../features/tasks/ui/todo-form/TodoForm';
import {
    addTask as addTaskAction,
    deleteTask as deleteTaskAction,
    updateTask as updateTaskAction
} from '../../features/tasks/model/tasksSlice';
import './TodoPage.css';
import { RootState } from '../../app/store/store';
import { Task } from '../../shared/types/task';
import { DeadlineFilter, Filter } from '../../shared/types/filters';

/**
 * TodoPage component is the main page for displaying and managing tasks.
 * It allows users to fetch, add, update, delete, and filter tasks.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 *
 * @example
 * <TodoPage />
 *
 * @remarks
 * This component uses several hooks:
 * - `useDispatch` to dispatch actions to the Redux store.
 * - `useSelector` to select tasks from the Redux store.
 * - `useState` to manage local state for filters and modal visibility.
 * - `useAuth` to get the authenticated user.
 * - `useSnackbar` to show notifications.
 * - `useEffect` to fetch tasks from the server when the component mounts or when the user or filter changes.
 *
 * The component also defines several asynchronous functions to handle task operations:
 * - `fetchTasks` to fetch tasks from the server.
 * - `removeTask` to delete a task.
 * - `updateTask` to update a task.
 * - `updateTaskOrder` to update the order of tasks.
 * - `addTask` to add a new task.
 *
 * The component renders a filter and add task button, a list of tasks, and a modal for adding new tasks.
 */
const TodoPage: React.FC = () => {
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks);
    const [filter, setFilter] = useState<Filter>('all');
    const { user } = useAuth();
    const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all-time');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { enqueueSnackbar } = useSnackbar();
    const filteredTasks = filterTasks(tasks, filter, deadlineFilter);

    // Получение задач с сервера
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                if (!user) throw new Error('User is null');
                const res = await getTasks(user.uid, filter);
                const sortedTasks = res.sort((a: Task, b: Task) => a.order - b.order); // Сортировка задач по полю order
                dispatch(addTaskAction(sortedTasks));
            } catch (err) {
                console.log('Ошибка при получении задач:', err);
                enqueueSnackbar('Error fetching tasks! Please try again later', { variant: 'error' });
            }
        };
        if (user) {
            fetchTasks();
        }
    }, [user, filter, dispatch, enqueueSnackbar]);

    // Удаление задачи
    const removeTask = async (id: string) => {
        try {
            await deleteTask(id);
            dispatch(deleteTaskAction(id));
            enqueueSnackbar('Task deleted', { variant: 'error' });
        } catch (err) {
            console.log('Ошибка при удалении задачи:', err);
            enqueueSnackbar('Error! Please try again later', { variant: 'error' });
        }
    };

    // Сохранение измененной задачи
    const updateTask = async (updatedTask: Task) => {
        try {
            const res = await putTask(updatedTask);
            dispatch(updateTaskAction(updatedTask));

            const originalTask = tasks.find(t => t._id === updatedTask._id);
            if (updatedTask.completed !== undefined && originalTask?.completed !== updatedTask.completed) {
                const message = updatedTask.completed ? 'Task completed' : 'Task restored';
                const variant = updatedTask.completed ? 'success' : 'info';
                enqueueSnackbar(message, { variant });

                // Обновление порядка задач
                const newTasks = tasks.map(t => t._id === updatedTask._id ? res : t);
                let incompleteTasks = newTasks.filter(task => !task.completed);
                let completeTasks = newTasks.filter(task => task.completed);
                if (updatedTask.completed) {
                    completeTasks = [res, ...completeTasks.filter(task => task._id !== updatedTask._id)];
                } else {
                    incompleteTasks = [res, ...incompleteTasks.filter(task => task._id !== updatedTask._id)];
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
    const updateTaskOrder = async (newTasks: Task[]) => {
        dispatch(addTaskAction(newTasks));
        try {
            if (!user) throw new Error('User is null');
            await putOrder(user.uid, newTasks);
        } catch (err) {
            console.log('Ошибка при обновлении порядка задач:', err);
            enqueueSnackbar('Error! Please try again later', { variant: 'error' });
        }
    };

    // Добавление новой задачи
    const addTask = async (taskParams: Omit<Task, '_id' | 'order' | 'userId' | 'completed'>) => {
        const minOrder = tasks.length > 0 ? Math.min(...tasks.map(task => task.order)) : 0;
        const newTask: Task = {
            ...taskParams,
            _id: '', // This should be generated by the backend
            completed: false,
            order: minOrder - 1,
            userId: user ? user.uid : '',
        };
        try {
            const res = await postTask(newTask);
            dispatch(addTaskAction([res, ...tasks]));
            enqueueSnackbar('Task added', { variant: 'success' });
        } catch (err) {
            console.log('Ошибка при добавлении задачи:', err);
            enqueueSnackbar('Error! Please try again later', { variant: 'error' });
        } finally {
            setIsModalOpen(false);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div>
            <div className="filter-add-task-container">
                <TodoFilter filter={filter} setFilter={setFilter} deadlineFilter={deadlineFilter} setDeadlineFilter={setDeadlineFilter} />
                <Button onClick={toggleModal} className="add-task-button">
                    <strong>+</strong> Add task
                </Button>
            </div>
            <TodoList tasks={filteredTasks} filter={filter} updateTask={updateTask} deleteTask={removeTask} updateTaskOrder={updateTaskOrder} />

            <Modal isOpen={isModalOpen} onClose={toggleModal}>
                <TodoForm addTask={addTask} />
            </Modal>
        </div>
    );
}

export default TodoPage;