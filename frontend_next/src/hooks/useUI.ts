import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
  openModal,
  closeModal,
  closeAllModals,
} from "@/store/slices/uiSlice";

export const useUI = () => {
  const dispatch = useAppDispatch();
  const uiState = useAppSelector((state) => state.ui);

  const { theme, sidebarOpen, notifications, loading, modals } = uiState;

  const updateTheme = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
  };

  const toggleSidebarState = () => {
    dispatch(toggleSidebar());
  };

  const updateSidebarOpen = (open: boolean) => {
    dispatch(setSidebarOpen(open));
  };

  const notify = (notification: {
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    autoClose?: boolean;
  }) => {
    dispatch(addNotification(notification));
  };

  const dismissNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  const clearAllNotifications = () => {
    dispatch(clearNotifications());
  };

  const updateLoading = (key: string, isLoading: boolean) => {
    dispatch(setLoading({ key, loading: isLoading }));
  };

  const updateGlobalLoading = (isLoading: boolean) => {
    dispatch(setGlobalLoading(isLoading));
  };

  const openModalDialog = (
    modalName: "uploadResume" | "deleteConfirm" | "settings",
  ) => {
    dispatch(openModal(modalName));
  };

  const closeModalDialog = (
    modalName: "uploadResume" | "deleteConfirm" | "settings",
  ) => {
    dispatch(closeModal(modalName));
  };

  const closeAllModalDialogs = () => {
    dispatch(closeAllModals());
  };

  return {
    theme,
    sidebarOpen,
    notifications,
    loading,
    modals,
    updateTheme,
    toggleSidebarState,
    updateSidebarOpen,
    notify,
    dismissNotification,
    clearAllNotifications,
    updateLoading,
    updateGlobalLoading,
    openModalDialog,
    closeModalDialog,
    closeAllModalDialogs,
  };
};
