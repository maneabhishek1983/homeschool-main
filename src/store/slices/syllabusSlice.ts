import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { syllabusService } from '../../services/syllabus/syllabusService';

interface SyllabusState {
  currentLearningPath: any | null;
  recommendations: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SyllabusState = {
  currentLearningPath: null,
  recommendations: [],
  loading: false,
  error: null
};

export const generateLearningPath = createAsyncThunk(
  'syllabus/generatePath',
  async ({ childId, yearGroup, subjects }: {
    childId: string;
    yearGroup: string;
    subjects: string[];
  }) => {
    return await syllabusService.generateLearningPath(childId, yearGroup, subjects);
  }
);

export const updateUnitProgress = createAsyncThunk(
  'syllabus/updateProgress',
  async ({ childId, unitId, progress }: {
    childId: string;
    unitId: string;
    progress: number;
  }) => {
    await syllabusService.updateLearningPath(childId, unitId, progress);
    return { unitId, progress };
  }
);

const syllabusSlice = createSlice({
  name: 'syllabus',
  initialState,
  reducers: {
    clearLearningPath: (state) => {
      state.currentLearningPath = null;
      state.recommendations = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Generate learning path
      .addCase(generateLearningPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateLearningPath.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLearningPath = action.payload;
        state.recommendations = action.payload.recommendations;
      })
      .addCase(generateLearningPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate learning path';
      })
      // Update unit progress
      .addCase(updateUnitProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUnitProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentLearningPath) {
          const unitIndex = state.currentLearningPath.units.findIndex(
            (u: any) => u.unitId === action.payload.unitId
          );
          if (unitIndex !== -1) {
            state.currentLearningPath.units[unitIndex].progress = action.payload.progress;
            if (action.payload.progress >= 100) {
              state.currentLearningPath.units[unitIndex].status = 'completed';
              state.currentLearningPath.units[unitIndex].completionDate = new Date();
            } else if (action.payload.progress > 0) {
              state.currentLearningPath.units[unitIndex].status = 'in-progress';
              if (!state.currentLearningPath.units[unitIndex].startDate) {
                state.currentLearningPath.units[unitIndex].startDate = new Date();
              }
            }
          }
        }
      })
      .addCase(updateUnitProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update unit progress';
      });
  }
});

export const { clearLearningPath } = syllabusSlice.actions;
export default syllabusSlice.reducer; 