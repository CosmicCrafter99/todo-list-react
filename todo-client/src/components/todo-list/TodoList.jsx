import TodoItem from '../todo-item/TodoItem';
import PropTypes from 'prop-types';
import './TodoList.css';

/**
 * Компонент списка задач.
 * @param {Object} props - Свойства компонента.
 * @param {Array<Object>} props.tasks - Список задач.
 * @param {number} props.tasks.id - Идентификатор задачи.
 * @param {string} props.tasks.text - Текст задачи.
 * @param {boolean} props.tasks.completed - Состояние завершенности задачи.
 * @param {function(number): void} props.toggleComplete - Функция для переключения состояния завершенности задачи.
 * @param {function(number): void} props.deleteTask - Функция для удаления задачи.
 * @param {function(): void} props.saveTask - Функция для сохранения задачи.
 * @returns {JSX.Element} Компонент TodoList.
 */
function TodoList({ tasks, toggleComplete, deleteTask, saveTask }) {
    // Сортировка задач: незавершенные задачи идут первыми
    const sortedTasks = tasks.sort((a, b) => a.completed - b.completed);

    return (
        <ul className="task-list">
            {sortedTasks.map((task, index) => (
                <TodoItem
                    key={index}
                    task={task}
                    toggleComplete={toggleComplete}
                    deleteTask={deleteTask}
                    saveTask={saveTask}
                />
            ))}
        </ul>
    );
}

TodoList.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
        })
    ).isRequired,
    toggleComplete: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired,
};

export default TodoList;