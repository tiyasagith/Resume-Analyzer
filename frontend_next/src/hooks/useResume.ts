import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUserAnalyses,
  fetchAnalysisById,
  saveAnalysis,
  deleteAnalysis,
  setCurrentAnalysis,
  setUploadProgress,
  clearError,
} from '@/store/slices/resumeSlice';

export const useResume = () => {
  const dispatch = useAppDispatch();
  const {
    analyses,
    currentAnalysis,
    loading,
    error,
    uploadProgress,
  } = useAppSelector((state) => state.resume);

  const getUserAnalyses = (userId: string) => {
    return dispatch(fetchUserAnalyses(userId));
  };

  const getAnalysisById = (id: string, userId: string) => {
    return dispatch(fetchAnalysisById({ id, userId }));
  };

  const createAnalysis = (analysisData: any) => {
    return dispatch(saveAnalysis(analysisData));
  };

  const removeAnalysis = (id: string, userId: string) => {
    return dispatch(deleteAnalysis({ id, userId }));
  };

  const setCurrentAnalysisData = (analysis: any) => {
    dispatch(setCurrentAnalysis(analysis));
  };

  const updateUploadProgress = (progress: number) => {
    dispatch(setUploadProgress(progress));
  };

  const clearResumeError = () => {
    dispatch(clearError());
  };

  return {
    analyses,
    currentAnalysis,
    loading,
    error,
    uploadProgress,
    getUserAnalyses,
    getAnalysisById,
    createAnalysis,
    removeAnalysis,
    setCurrentAnalysisData,
    updateUploadProgress,
    clearResumeError,
  };
};
