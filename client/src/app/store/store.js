import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other slices here (e.g., tasks, expenses)
    },
});