import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Activity, ABAActivity } from '../../models/types';
import { activityService } from '../../services/firebase/database';

interface ActivitiesState {
  activities: Activity[];
  abaActivities: ABAActivity[];
  loading: boolean;
  error: string | null;
  currentActivity: Activity | null;
}

const initialState: ActivitiesState = {
  activities: [],
  abaActivities: [],
  loading: false,
  error: null,
  currentActivity: null,
};

// Async thunks
export const fetchActivitiesByYearGroup = createAsyncThunk(
  'activities/fetchByYearGroup',
  async (yearGroup: string) => {
    const activities = await activityService.getActivitiesByYearGroup(yearGroup);
    return activities;
  }
);

export const createActivity = createAsyncThunk(
  'activities/create',
  async (activity: Omit<Activity, 'id'>) => {
    const id = await activityService.createActivity(activity);
    return { ...activity, id };
  }
);

export const createABAActivity = createAsyncThunk(
  'activities/createABA',
  async (activity: Omit<ABAActivity, 'id'>) => {
    const id = await activityService.createABAActivity(activity);
    return { ...activity, id };
  }
);

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setCurrentActivity: (state, action) => {
      state.currentActivity = action.payload;
    },
    clearCurrentActivity: (state) => {
      state.currentActivity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivitiesByYearGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivitiesByYearGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivitiesByYearGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch activities';
      })
      // Create activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activities.push(action.payload);
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create activity';
      })
      // Create ABA activity
      .addCase(createABAActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createABAActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.abaActivities.push(action.payload);
      })
      .addCase(createABAActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create ABA activity';
      });
  },
});

export const { setCurrentActivity, clearCurrentActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer; 