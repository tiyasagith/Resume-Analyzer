import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    analysis: null,
    loading: false,
  },
  reducers: {
    setAnalysis: (state, action) => {
      state.analysis = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAnalysis, setLoading } = reviewSlice.actions;
export default reviewSlice.reducer;
