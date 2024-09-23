import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: [],
    reducers: {
        addTask: (state, action) => {
            return action.payload;
        },
        deleteTask: (state, action) => {
            return state.filter(task => task._id !== action.payload);
        },
        updateTask: (state, action) => {
            const index = state.findIndex(task => task._id === action.payload._id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
    },
});

export const { addTask, deleteTask, updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;