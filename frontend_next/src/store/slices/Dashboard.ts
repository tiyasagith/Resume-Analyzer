import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    AllResumeData: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAllResumeData: (state, action) => {
      state.AllResumeData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setAllResumeData, setLoading, setError } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;
