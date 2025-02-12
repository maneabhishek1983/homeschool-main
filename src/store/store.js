import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import activitiesReducer from './slices/activitiesSlice';
import syllabusReducer from './slices/syllabusSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    activities: activitiesReducer,
    syllabus: syllabusReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setUser', 'activities/setActivities'],
        ignoredActionPaths: ['payload.timestamp', 'payload.createdAt', 'payload.updatedAt'],
        ignoredPaths: ['auth.timestamp', 'activities.timestamp']
      }
    })
});

export default store; 