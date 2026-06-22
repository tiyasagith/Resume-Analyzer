import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { endpoints, apiHelpers } from '@/context/endPoint';

// Create axios instance with default configuration
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.BASE_URL || "http://localhost:8080/api",
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

// Resume Analysis API services
export const resumeAnalysisApi = {
  // Create new resume analysis
  create: async (data: any) => {
    const response = await api.post(endpoints.resumeAnalysis.create, data);
    return response.data;
  },

  // Get all analyses for a user
  getUserAnalyses: async (userId: string) => {
    const response = await api.get(endpoints.resumeAnalysis.getByUser(userId));
    return response.data;
  },

  // Get specific analysis by ID
  getAnalysisById: async (id: string, userId: string) => {
    const response = await api.get(endpoints.resumeAnalysis.getById(id, userId));
    return response.data;
  },

  // Get analysis by file ID
  getAnalysisByFileId: async (fileId: string, userId: string) => {
    const response = await api.get(endpoints.resumeAnalysis.getByFileId(fileId, userId));
    return response.data;
  },

  // Delete analysis
  deleteAnalysis: async (id: string, userId: string) => {
    const response = await api.delete(endpoints.resumeAnalysis.delete(id, userId));
    return response.data;
  },

  // Get user statistics
  getUserStatistics: async (userId: string) => {
    const response = await api.get(endpoints.resumeAnalysis.getStatistics(userId));
    return response.data;
  },
};

// Authentication API services
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await api.post(endpoints.auth.login, credentials);
    return response.data;
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post(endpoints.auth.register, userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get(endpoints.auth.profile);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(endpoints.auth.logout);
    return response.data;
  },
};

// User management API services
export const userApi = {
  getUser: async (userId: string) => {
    const response = await api.get(endpoints.users.getById(userId));
    return response.data;
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await api.put(endpoints.users.update(userId), userData);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(endpoints.users.delete(userId));
    return response.data;
  },

  getUserProfile: async (userId: string) => {
    const response = await api.get(endpoints.users.getProfile(userId));
    return response.data;
  },
};

// File upload API services
export const fileApi = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(endpoints.files.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data;
  },

  downloadFile: async (fileId: string) => {
    const response = await api.get(endpoints.files.download(fileId), {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteFile: async (fileId: string) => {
    const response = await api.delete(endpoints.files.delete(fileId));
    return response.data;
  },
};

// Analytics API services
export const analyticsApi = {
  getUserStats: async (userId: string) => {
    const response = await api.get(endpoints.analytics.getUserStats(userId));
    return response.data;
  },

  getOverallStats: async () => {
    const response = await api.get(endpoints.analytics.getOverallStats);
    return response.data;
  },

  getTrends: async (userId: string) => {
    const response = await api.get(endpoints.analytics.getTrends(userId));
    return response.data;
  },
};

// Settings API services
export const settingsApi = {
  getUserSettings: async (userId: string) => {
    const response = await api.get(endpoints.settings.getUserSettings(userId));
    return response.data;
  },

  updateUserSettings: async (userId: string, settings: any) => {
    const response = await api.put(endpoints.settings.updateUserSettings(userId), settings);
    return response.data;
  },
};

// Generic API utilities
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error: any) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'Server error occurred';
      const status = error.response.status;
      return { message, status, details: error.response.data };
    } else if (error.request) {
      // Request was made but no response received
      return { message: 'Network error. Please check your connection.', status: 0 };
    } else {
      // Something else happened
      return { message: error.message || 'An unexpected error occurred', status: -1 };
    }
  },

  // Retry failed requests
  retryRequest: async (requestFn: () => Promise<any>, maxRetries = 3) => {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
      }
    }
    
    throw lastError;
  },
};

export default api;
