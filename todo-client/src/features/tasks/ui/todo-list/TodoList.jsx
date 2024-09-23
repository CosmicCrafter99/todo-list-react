import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';
import './TodoList.css';

/**
 * Компонент списка задач.
 * @param {Object} props - Свойства компонента.
 * @param {Array} props.tasks - Список задач.
 * @param {function(string): void} props.deleteTask - Функция для удаления задачи.
 * @param {function(Object): void} props.updateTask - Функция для сохранения изменений задачи.
 * @param {function(Array): void} props.updateTaskOrder - Функция для обновления порядка задач.
 * @returns {JSX.Element} Компонент TodoList.
 */
function TodoList({ tasks, filter, updateTask, deleteTask, updateTaskOrder }) {
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(tasks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        // Обновление порядка задач
        const updatedTasks = items.map((task, index) => ({
            ...task,
            order: index
        }));

        updateTaskOrder(updatedTasks);
    };

    if (!tasks.length) {
        return <p className="empty-list">No tasks yet</p>;
    }

    // Разделение задач на завершенные и незавершенные
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completeTasks = tasks.filter(task => task.completed);


    return (
        <>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks">
                    {(provided) => (
                        <div className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                            {incompleteTasks.length ? incompleteTasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={`todo-item-wrapper ${task.completed ? 'completed' : ''}`}
                                        >
                                            <TodoItem
                                                task={task}
                                                updateTask={updateTask}
                                                deleteTask={deleteTask}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            )) : (filter === 'all' ? <p className="empty-list">No incomplete tasks</p> : null)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {filter !== 'incomplete' && <h2>Completed tasks</h2>}
            {completeTasks.length ? completeTasks.map((task) => (
                <div
                    className={`todo-item-wrapper ${task.completed ? 'completed' : ''}`}
                >
                    <TodoItem
                        task={task}
                        updateTask={updateTask}
                        deleteTask={deleteTask}
                    />
                </div>
            )) : (filter === 'all' ? <p className="empty-list">No completed tasks</p> : null)}
        </>

    );
}

TodoList.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
            deadline: PropTypes.string,
            order: PropTypes.number.isRequired,
        })
    ).isRequired,
    filter: PropTypes.string.isRequired,
    updateTask: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    updateTaskOrder: PropTypes.func.isRequired,
};

export default TodoList;