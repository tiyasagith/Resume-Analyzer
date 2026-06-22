const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const endpoints = {
  // Authentication endpoints
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    profile: `${API_BASE_URL}/auth/me`,
    logout: `${API_BASE_URL}/auth/logout`,
  },

  // Resume analysis endpoints
  resumeAnalysis: {
    // Base endpoints
    base: `${API_BASE_URL}/resume-analysis`,

    // CRUD operations
    create: `${API_BASE_URL}/resume-analysis`,
    getAll: `${API_BASE_URL}/resume-analysis`,

    // User-specific operations
    getByUser: (userId: string) =>
      `${API_BASE_URL}/resume-analysis/user/${userId}`,
    getStatistics: (userId: string) =>
      `${API_BASE_URL}/resume-analysis/statistics/${userId}`,

    // Specific analysis operations
    getById: (id: string, userId: string) =>
      `${API_BASE_URL}/resume-analysis?id=${id}&userId=${userId}`,
    getByFileId: (fileId: string, userId: string) =>
      `${API_BASE_URL}/resume-analysis/file/${fileId}?userId=${userId}`,
    delete: (id: string, userId: string) =>
      `${API_BASE_URL}/resume-analysis/${id}?userId=${userId}`,

    // Alternative endpoints (if needed)
    getByIdSimple: `${API_BASE_URL}/resume-analysis`,
    getByFileIdSimple: (fileId: string) =>
      `${API_BASE_URL}/resume-analysis/file/${fileId}`,
    deleteSimple: (id: string) => `${API_BASE_URL}/resume-analysis/${id}`,
  },

  // File upload endpoints (if available)
  files: {
    upload: `${API_BASE_URL}/files/upload`,
    download: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
    delete: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
  },

  // User management endpoints
  users: {
    get: `${API_BASE_URL}/users`,
    getById: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    update: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    delete: (userId: string) => `${API_BASE_URL}/users/${userId}`,
    getProfile: (userId: string) => `${API_BASE_URL}/users/${userId}/profile`,
  },

  // Analytics and reporting endpoints
  analytics: {
    getUserStats: (userId: string) =>
      `${API_BASE_URL}/analytics/user/${userId}`,
    getOverallStats: `${API_BASE_URL}/analytics/overall`,
    getTrends: (userId: string) => `${API_BASE_URL}/analytics/trends/${userId}`,
  },

  // Settings and preferences
  settings: {
    getUserSettings: (userId: string) => `${API_BASE_URL}/settings/${userId}`,
    updateUserSettings: (userId: string) =>
      `${API_BASE_URL}/settings/${userId}`,
  },
};

// Helper functions for common operations
export const apiHelpers = {
  // Build query parameters
  buildQuery: (params: Record<string, any>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    return query.toString();
  },

  // Common headers
  getHeaders: (token?: string) => ({
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }),

  // Multipart headers for file uploads
  getMultipartHeaders: (token?: string) => ({
    ...(token && { Authorization: `Bearer ${token}` }),
  }),
};

// Export default API base URL for direct usage
export default API_BASE_URL;
