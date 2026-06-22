# API Services Documentation

This directory contains the API service layer for the Resume Analyzer frontend application.

## Structure

```
src/services/
├── apiService.ts    # Main API service with axios configuration
└── README.md        # This documentation file
```

## API Services Overview

### 1. Resume Analysis API (`resumeAnalysisApi`)

Handles all resume analysis operations:

```typescript
// Create new analysis
await resumeAnalysisApi.create(analysisData);

// Get all user analyses
await resumeAnalysisApi.getUserAnalyses(userId);

// Get specific analysis
await resumeAnalysisApi.getAnalysisById(id, userId);

// Get analysis by file ID
await resumeAnalysisApi.getAnalysisByFileId(fileId, userId);

// Delete analysis
await resumeAnalysisApi.deleteAnalysis(id, userId);

// Get user statistics
await resumeAnalysisApi.getUserStatistics(userId);
```

### 2. Authentication API (`authApi`)

Handles user authentication:

```typescript
// Login
await authApi.login({ email, password });

// Register
await authApi.register({ name, email, password });

// Get user profile
await authApi.getProfile();

// Logout
await authApi.logout();
```

### 3. User Management API (`userApi`)

Handles user operations:

```typescript
// Get user details
await userApi.getUser(userId);

// Update user
await userApi.updateUser(userId, userData);

// Delete user
await userApi.deleteUser(userId);

// Get user profile
await userApi.getUserProfile(userId);
```

### 4. File Management API (`fileApi`)

Handles file operations:

```typescript
// Upload file with progress tracking
await fileApi.uploadFile(file, (progress) => console.log(progress));

// Download file
await fileApi.downloadFile(fileId);

// Delete file
await fileApi.deleteFile(fileId);
```

### 5. Analytics API (`analyticsApi`)

Handles analytics and reporting:

```typescript
// Get user statistics
await analyticsApi.getUserStats(userId);

// Get overall statistics
await analyticsApi.getOverallStats();

// Get user trends
await analyticsApi.getTrends(userId);
```

### 6. Settings API (`settingsApi`)

Handles user settings:

```typescript
// Get user settings
await settingsApi.getUserSettings(userId);

// Update user settings
await settingsApi.updateUserSettings(userId, settings);
```

## Configuration

### Base URL Configuration

The API base URL is configured via environment variables:

```typescript
const API_BASE_URL = process.env.BASE_URL || "http://localhost:8080/api";
```

### Environment Variables

Create a `.env.local` file in your project root:

```env
BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Axios Configuration

The API service includes:

- **Request Interceptors**: Automatically adds authentication token
- **Response Interceptors**: Handles 401 unauthorized responses
- **Error Handling**: Consistent error handling across all API calls
- **Timeout**: 30-second timeout for all requests

### Authentication

The service automatically includes the JWT token in all requests:

```typescript
// Token is automatically added to headers
Authorization: Bearer <your-token>
```

## Error Handling

### Error Response Format

All API errors are handled consistently:

```typescript
{
  message: string,    // Human-readable error message
  status: number,     // HTTP status code
  details: any        // Additional error details
}
```

### Error Types

1. **Network Errors**: Connection issues, timeout, etc.
2. **Server Errors**: 5xx status codes
3. **Client Errors**: 4xx status codes (including 401 unauthorized)
4. **Validation Errors**: 400 bad request

### Using Error Handling

```typescript
import { apiUtils } from '@/services/apiService';

try {
  const response = await resumeAnalysisApi.getUserAnalyses(userId);
  // Handle success
} catch (error) {
  const errorInfo = apiUtils.handleError(error);
  console.error(errorInfo.message);
}
```

## Request/Response Format

### Standard Response Format

All API responses follow this format:

```typescript
{
  success: boolean,
  message?: string,
  data?: any,
  error?: string
}
```

### Request Headers

Standard headers are automatically included:

```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'  // When authenticated
}
```

## Usage Examples

### Basic Usage

```typescript
import { resumeAnalysisApi } from '@/services/apiService';

// Fetch user analyses
const fetchAnalyses = async (userId: string) => {
  try {
    const response = await resumeAnalysisApi.getUserAnalyses(userId);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message);
  } catch (error) {
    console.error('Failed to fetch analyses:', error);
    throw error;
  }
};
```

### File Upload with Progress

```typescript
import { fileApi } from '@/services/apiService';

const uploadResume = async (file: File) => {
  try {
    const response = await fileApi.uploadFile(file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
    });
    return response.data;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};
```

### Retry Failed Requests

```typescript
import { apiUtils, resumeAnalysisApi } from '@/services/apiService';

const fetchWithRetry = async (userId: string) => {
  try {
    return await apiUtils.retryRequest(
      () => resumeAnalysisApi.getUserAnalyses(userId),
      3 // Max 3 retries
    );
  } catch (error) {
    console.error('All retries failed:', error);
    throw error;
  }
};
```

## Integration with Redux

The API services are integrated with Redux slices:

- **resumeSlice**: Uses `resumeAnalysisApi`
- **authSlice**: Uses `authApi`
- **userSlice**: Uses `userApi` (when implemented)

### Example: Redux Integration

```typescript
// In your Redux slice
export const fetchUserAnalyses = createAsyncThunk(
  'resume/fetchUserAnalyses',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await resumeAnalysisApi.getUserAnalyses(userId);
      if (!response.success) throw new Error(response.message);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

## Best Practices

1. **Always check response.success**: API responses include a success flag
2. **Handle errors gracefully**: Use the provided error handling utilities
3. **Use TypeScript**: All services are fully typed
4. **Don't store tokens in Redux**: Use localStorage for security
5. **Use file upload progress**: Provide feedback to users during uploads
6. **Implement retry logic**: Use the retry utility for critical operations

## Testing

### Mock API for Testing

You can mock the API service for testing:

```typescript
jest.mock('@/services/apiService', () => ({
  resumeAnalysisApi: {
    getUserAnalyses: jest.fn(),
    create: jest.fn(),
    // ... other methods
  },
  authApi: {
    login: jest.fn(),
    register: jest.fn(),
    // ... other methods
  },
}));
```

### Example Test

```typescript
import { resumeAnalysisApi } from '@/services/apiService';

describe('Resume Analysis API', () => {
  it('should fetch user analyses', async () => {
    const mockData = { success: true, data: [] };
    (resumeAnalysisApi.getUserAnalyses as jest.Mock).mockResolvedValue(mockData);
    
    const result = await resumeAnalysisApi.getUserAnalyses('user123');
    expect(result).toEqual(mockData);
  });
});
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from your frontend domain
2. **Authentication Issues**: Check that tokens are properly stored and sent
3. **Network Timeouts**: Increase timeout for large file uploads
4. **401 Errors**: Token may be expired - implement token refresh logic

### Debug Mode

Enable debug logging:

```typescript
// In development
if (process.env.NODE_ENV === 'development') {
  console.log('API Request:', config);
  console.log('API Response:', response);
}
```

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh
2. **Caching**: Add response caching for GET requests
3. **Offline Support**: Add offline queue for failed requests
4. **WebSocket Integration**: Real-time updates for analysis progress
5. **Request Cancellation**: Add abort controller support
