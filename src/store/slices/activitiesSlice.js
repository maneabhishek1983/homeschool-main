import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Async thunk for fetching activities
export const fetchActivitiesByYearGroup = createAsyncThunk(
  'activities/fetchByYearGroup',
  async (yearGroup) => {
    try {
      const activitiesRef = collection(db, 'activities');
      const q = query(activitiesRef, where('yearGroup', '==', yearGroup));
      const querySnapshot = await getDocs(q);
      
      const activities = [];
      querySnapshot.forEach((doc) => {
        activities.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return activities;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  activities: [],
  loading: false,
  error: null
};

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivitiesByYearGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesByYearGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
        state.error = null;
      })
      .addCase(fetchActivitiesByYearGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer; 