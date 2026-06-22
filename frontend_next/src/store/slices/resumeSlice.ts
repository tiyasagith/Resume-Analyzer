import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { resumeAnalysisApi } from "@/services/apiService";

export interface ResumeAnalysis {
  id: string;
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  userId: string;
  resumeText: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  fileId: string;
  analysisResult: any;
  overallScore: number;
  createdAt: string;
  updatedAt: string;
}

interface ResumeState {
  analyses: ResumeAnalysis[];
  currentAnalysis: ResumeAnalysis | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: ResumeState = {
  analyses: [],
  currentAnalysis: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

// Async thunks
export const fetchUserAnalyses = createAsyncThunk(
  "resume/fetchUserAnalyses",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await resumeAnalysisApi.getUserAnalyses(userId);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch analyses");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch analyses",
      );
    }
  },
);

export const fetchAnalysisById = createAsyncThunk(
  "resume/fetchAnalysisById",
  async (
    { id, userId }: { id: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await resumeAnalysisApi.getAnalysisById(id, userId);
      if (!response.success)
        throw new Error(response.message || "Failed to fetch analysis");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch analysis",
      );
    }
  },
);

export const saveAnalysis = createAsyncThunk(
  "resume/saveAnalysis",
  async (analysisData: Partial<ResumeAnalysis>, { rejectWithValue }) => {
    try {
      const response = await resumeAnalysisApi.create(analysisData);
      if (!response.success)
        throw new Error(response.message || "Failed to save analysis");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to save analysis",
      );
    }
  },
);

export const deleteAnalysis = createAsyncThunk(
  "resume/deleteAnalysis",
  async (
    { id, userId }: { id: string; userId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await resumeAnalysisApi.deleteAnalysis(id, userId);
      if (!response.success)
        throw new Error(response.message || "Failed to delete analysis");
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete analysis",
      );
    }
  },
);

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setCurrentAnalysis: (
      state,
      action: PayloadAction<ResumeAnalysis | null>,
    ) => {
      state.currentAnalysis = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: (state) => {
      state.analyses = [];
      state.currentAnalysis = null;
      state.loading = false;
      state.error = null;
      state.uploadProgress = 0;
    },
  },
  extraReducers: (builder) => {
    // Fetch user analyses
    builder
      .addCase(fetchUserAnalyses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalyses.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = action.payload;
      })
      .addCase(fetchUserAnalyses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch analysis by ID
    builder
      .addCase(fetchAnalysisById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAnalysis = action.payload;
      })
      .addCase(fetchAnalysisById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Save analysis
    builder
      .addCase(saveAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses.unshift(action.payload);
        state.currentAnalysis = action.payload;
      })
      .addCase(saveAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete analysis
    builder
      .addCase(deleteAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.analyses = state.analyses.filter(
          (analysis) => analysis.id !== action.payload,
        );
        if (state.currentAnalysis?.id === action.payload) {
          state.currentAnalysis = null;
        }
      })
      .addCase(deleteAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentAnalysis, setUploadProgress, clearError, resetState } =
  resumeSlice.actions;
export default resumeSlice.reducer;
