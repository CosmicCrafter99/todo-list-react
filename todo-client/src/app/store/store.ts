import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../../features/tasks/model/tasksSlice';

/**
 * Configures and creates the Redux store for the application.
 * 
 * The store is configured with a single reducer:
 * - `tasks`: Manages the state related to tasks using the `tasksReducer`.
 * 
 * @returns The configured Redux store.
 */
const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

// Типизация для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;