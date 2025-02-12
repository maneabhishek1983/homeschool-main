import { createSlice } from '@reduxjs/toolkit';

// Helper function to serialize user data
const serializeUser = (user) => {
  if (!user) return null;
  // Only include serializable properties
  return {
    uid: user.uid || null,
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    isAnonymous: user.isAnonymous || false,
    emailVerified: user.emailVerified || false,
    metadata: {
      createdAt: user.metadata?.createdAt || null,
      lastLoginAt: user.metadata?.lastLoginAt || null
    }
  };
};

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  loginInProgress: false,
  lastLoginAttempt: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const serializedUser = serializeUser(action.payload);
      if (serializedUser?.uid === state.user?.uid && state.isAuthenticated) {
        // Prevent duplicate updates for the same user
        return;
      }
      state.user = serializedUser;
      state.isAuthenticated = !!serializedUser;
      state.loading = false;
      state.error = null;
      state.loginInProgress = false;
      state.lastLoginAttempt = Date.now();
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.loginInProgress = false;
      state.lastLoginAttempt = null;
    },
    setLoading: (state, action) => {
      if (state.loginInProgress) {
        // Prevent multiple concurrent login attempts
        return;
      }
      state.loading = action.payload;
      state.loginInProgress = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action) => {
      // Format error message for better debugging
      const errorMessage = action.payload instanceof Error 
        ? {
            code: action.payload.code || 'unknown',
            message: action.payload.message,
            timestamp: Date.now()
          }
        : {
            code: 'custom',
            message: String(action.payload),
            timestamp: Date.now()
          };
      
      state.error = errorMessage;
      state.loading = false;
      state.loginInProgress = false;
    }
  }
});

export const { setUser, clearUser, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;