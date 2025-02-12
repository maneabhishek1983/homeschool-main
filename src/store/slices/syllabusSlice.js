const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit');
const { collection, doc, getDoc, setDoc, updateDoc } = require('firebase/firestore');
const { db } = require('../../config/firebase');

const initialState = {
  currentLearningPath: null,
  recommendations: [],
  loading: false,
  error: null
};

const generateLearningPath = createAsyncThunk(
  'syllabus/generateLearningPath',
  async ({ childId, yearGroup, subjects }) => {
    const learningPathRef = doc(db, 'learningPaths', childId);
    const learningPath = {
      childId,
      yearGroup,
      subjects,
      units: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    await setDoc(learningPathRef, learningPath);
    return learningPath;
  }
);

const updateUnitProgress = createAsyncThunk(
  'syllabus/updateUnitProgress',
  async ({ childId, unitId, progress }) => {
    const learningPathRef = doc(db, 'learningPaths', childId);
    const learningPathDoc = await getDoc(learningPathRef);
    
    if (!learningPathDoc.exists()) {
      throw new Error('Learning path not found');
    }

    const learningPath = learningPathDoc.data();
    const updatedUnits = learningPath.units.map(unit => 
      unit.id === unitId ? { ...unit, progress } : unit
    );

    await updateDoc(learningPathRef, {
      units: updatedUnits,
      updatedAt: new Date()
    });

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
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLearningPath.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateLearningPath.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLearningPath = action.payload;
      })
      .addCase(generateLearningPath.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateUnitProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUnitProgress.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentLearningPath) {
          state.currentLearningPath.units = state.currentLearningPath.units.map(unit =>
            unit.id === action.payload.unitId
              ? { ...unit, progress: action.payload.progress }
              : unit
          );
        }
      })
      .addCase(updateUnitProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

module.exports = {
  generateLearningPath,
  updateUnitProgress,
  clearLearningPath: syllabusSlice.actions.clearLearningPath,
  syllabusReducer: syllabusSlice.reducer
}; 