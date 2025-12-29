// Task status type
export type TaskStatus = 'pending' | 'in_progress' | 'done';

// Task interface
export interface Task {
  id: string | number;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}

// Auth response interface
export interface AuthResponse {
  data: any;
  token: string;
  user?: {
    id: string | number;
    email: string;
  };
}

// Tasks response interface
export interface TasksResponse {
  tasks?: Task[];
  task?: Task;
}

// API Error interface
export interface ApiError {
  response?: {
    data?: {
      error: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

