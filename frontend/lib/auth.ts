import apiClient from "./axios";

export interface RegisterDto {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

export const authApi = {
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  me: async (): Promise<unknown> => {
    const response = await apiClient.get("/auth/me");
    return response.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await apiClient.post("/auth/refresh-token");
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem("token");
    // We're assuming JWT stored in localStorage and HTTP-only cookies aren't used in this example
    // If using HTTP-only cookies, we would call a logout endpoint to clear them
  },
};
