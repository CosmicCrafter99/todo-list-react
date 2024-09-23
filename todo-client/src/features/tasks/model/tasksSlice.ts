import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task } from '../../../shared/types/task';

/**
 * A slice for managing tasks in the todo list application.
 * 
 * @remarks
 * This slice includes actions for adding, deleting, and updating tasks.
 * 
 * @example
 * ```typescript
 * import { tasksSlice } from './tasksSlice';
 * 
 * // Dispatching actions
 * dispatch(tasksSlice.actions.addTask([{ _id: '1', title: 'New Task' }]));
 * dispatch(tasksSlice.actions.deleteTask('1'));
 * dispatch(tasksSlice.actions.updateTask({ _id: '1', title: 'Updated Task' }));
 * ```
 * 
 * @public
 */
const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [] as Task[],
    reducers: {
        addTask: (state, action: PayloadAction<Task[]>) => {
            return action.payload;
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            return state.filter(task => task._id !== action.payload);
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
    },
});

export const { addTask, deleteTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;