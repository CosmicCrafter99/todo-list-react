import React from 'react';
import TodoItem from './TodoItem';

/**
 * Компонент списка задач.
 * @param {Object} props - Свойства компонента.
 * @param {Array<Object>} props.tasks - Список задач.
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

export default TodoList;