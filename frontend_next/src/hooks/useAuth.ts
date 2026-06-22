import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  login,
  register,
  logout,
  checkAuth,
  clearError,
  setToken,
} from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);

  const { user, token, isAuthenticated, loading, error } = authState;

  const loginUser = (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };

  const registerUser = (name: string, email: string, password: string) => {
    return dispatch(register({ name, email, password }));
  };

  const logoutUser = () => {
    return dispatch(logout());
  };

  const checkAuthentication = () => {
    return dispatch(checkAuth());
  };

  const setAuthToken = (token: string) => {
    dispatch(setToken(token));
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    checkAuthentication,
    setAuthToken,
    clearError: clearAuthError,
  };
};
