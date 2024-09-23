import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../features/tasks/model/tasksSlice';

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

export default store;