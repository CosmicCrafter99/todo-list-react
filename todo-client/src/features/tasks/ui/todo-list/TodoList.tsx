import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Task } from '../../../../shared/types/task';
import TodoItem from './TodoItem';
import './TodoList.css';

interface TodoListProps {
    tasks: Task[];
    filter: string;
    updateTask: (task: Task) => void;
    deleteTask: (taskId: string) => void;
    updateTaskOrder: (tasks: Task[]) => void;
}

/**
 * Компонент списка задач.
 * @param {TodoListProps} props - Свойства компонента.
 * @returns {JSX.Element} Компонент TodoList.
 */
const TodoList: React.FC<TodoListProps> = ({ tasks, filter, updateTask, deleteTask, updateTaskOrder }) => {
    const handleOnDragEnd = (result: DropResult) => {
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
                    key={task._id}
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
};

export default TodoList;
