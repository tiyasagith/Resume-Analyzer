import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "./slices/resumeSlice";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import dashboardReducer from "./slices/Dashboard";
import reviewReducer from "../container/review/ReviewReducer";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    auth: authReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    review: reviewReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
