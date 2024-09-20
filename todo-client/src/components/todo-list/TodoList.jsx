import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import TodoItem from '../todo-item/TodoItem';
import './TodoList.css';

/**
 * Компонент списка задач.
 * @param {Object} props - Свойства компонента.
 * @param {Array} props.tasks - Список задач.
 * @param {function(string): void} props.toggleComplete - Функция для переключения состояния выполнения задачи.
 * @param {function(string): void} props.deleteTask - Функция для удаления задачи.
 * @param {function(Object): void} props.saveTask - Функция для сохранения изменений задачи.
 * @param {function(Array): void} props.updateTaskOrder - Функция для обновления порядка задач.
 * @returns {JSX.Element} Компонент TodoList.
 */
function TodoList({ tasks, toggleComplete, deleteTask, saveTask, updateTaskOrder }) {
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

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="tasks">
                {(provided) => (
                    <div className="todo-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {tasks.map((task, index) => (
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
                                            toggleComplete={toggleComplete}
                                            deleteTask={deleteTask}
                                            saveTask={saveTask}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

TodoList.propTypes = {
    tasks: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
            completed: PropTypes.bool.isRequired,
            deadline: PropTypes.string,
        })
    ).isRequired,
    toggleComplete: PropTypes.func.isRequired,
    deleteTask: PropTypes.func.isRequired,
    saveTask: PropTypes.func.isRequired,
    updateTaskOrder: PropTypes.func.isRequired,
};

export default TodoList;