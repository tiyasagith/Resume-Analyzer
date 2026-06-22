export interface ApiResponse {
  status: number;
  data: any;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userName: string;
  email: string;
  profileImage?: string;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  userName: string;
  email: string;
  profileImage?: string;
}
