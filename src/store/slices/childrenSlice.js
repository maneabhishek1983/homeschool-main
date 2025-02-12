import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  children: [],
  selectedChild: null,
  loading: false,
  error: null,
};

const childrenSlice = createSlice({
  name: 'children',
  initialState,
  reducers: {
    setChildren: (state, action) => {
      state.children = action.payload;
      if (action.payload.length > 0 && !state.selectedChild) {
        state.selectedChild = action.payload[0].id;
      }
    },
    setSelectedChild: (state, action) => {
      state.selectedChild = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChildren: (state) => {
      state.children = [];
      state.selectedChild = null;
      state.error = null;
    },
  },
});

export const { 
  setChildren, 
  setSelectedChild, 
  setLoading, 
  setError,
  clearChildren 
} = childrenSlice.actions;

export default childrenSlice.reducer; 