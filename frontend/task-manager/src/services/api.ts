import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, TasksResponse, Task, TaskStatus } from '../types';

// Base URL for the backend API
// const API_BASE_URL = 'http://localhost:3000';

// Fix: Use 'as string' to avoid type errors when accessing VITE_API_URL
const API_BASE_URL = (import.meta as any).env.VITE_API_URL as string;

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Only handle 401 errors (not network errors or other status codes)
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || '';
      const currentPath = window.location.pathname;
      
      // Don't redirect for auth endpoints (login/register)
      // These should handle their own errors
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');
      
      if (!isAuthEndpoint) {
        // Only remove token and redirect if we're on a protected route
        // and not already on login/register page
        const isProtectedRoute = currentPath.includes('/tasks') || currentPath === '/';
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register');
        
        if (isProtectedRoute && !isAuthPage) {
          localStorage.removeItem('token');
          // Use replace to avoid adding to history
          window.location.replace('/login');
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  // Register a new user - NOW WITH NAME
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<any>('/api/auth/register', {
      name,
      email,
      password,
    });
    // Log the response for debugging
    console.log('Register API response:', response.data);
    return response.data;
  },

  // Login user
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<any>('/api/auth/login', {
      email,
      password,
    });
    // Log the response for debugging
    console.log('Login API response:', response.data);
    return response.data;
  },
};

// Tasks API functions
export const tasksAPI = {
  // Get all tasks
  getTasks: async (): Promise<Task[] | TasksResponse> => {
    const response = await api.get<Task[] | TasksResponse>('/api/tasks');
    return response.data;
  },

  // Create a new task
  createTask: async (title: string, description: string): Promise<Task | TasksResponse> => {
    const response = await api.post<Task | TasksResponse>('/api/tasks', {
      title,
      description,
    });
    return response.data;
  },

  // Update task status
  updateTaskStatus: async (taskId: string | number, status: TaskStatus): Promise<Task | TasksResponse> => {
    const response = await api.patch<Task | TasksResponse>(`/api/tasks/${taskId}`, {
      status,
    });
    return response.data;
  },

  // Update entire task (title, description, status)
  updateTask: async (taskId: string | number, title: string, description: string, status: TaskStatus): Promise<Task | TasksResponse> => {
    const response = await api.put<Task | TasksResponse>(`/api/tasks/${taskId}`, {
      title,
      description,
      status,
    });
    return response.data;
  },

  // Delete a task
  deleteTask: async (taskId: string | number): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },
};

export default api;