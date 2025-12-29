import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { tasksAPI } from '../services/api';
import TaskItem from '../components/TaskItem';
import { Task, TaskStatus, ApiError } from '../types';

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const userName = localStorage.getItem('userName');
  // Fetch tasks on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');


    if (token) {
      fetchTasks();
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // Fetch all tasks from API
  const fetchTasks = async (): Promise<void> => {
    try {
      setLoading(true);
      setError('');
      const response = await tasksAPI.getTasks();

      console.log(response, "tasks response");
      
      // Handle the response format: {success: true, data: Array}
      if (response && typeof response === 'object' && 'data' in response) {
        const data = (response as any).data;
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      } else if (Array.isArray(response)) {
        setTasks(response);
      } else {
        setTasks([]);
      }
    } catch (err) {
      const apiError = err as ApiError;
      if (apiError.response?.status !== 401) {
        setError(apiError.response?.data?.message || 'Failed to fetch tasks. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to create new task
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await tasksAPI.createTask(title, description);
      
      // Handle response format
      let newTask: Task;
      if (response && typeof response === 'object') {
        if ('data' in response) {
          newTask = (response as any).data;
        } else if ('task' in response) {
          newTask = (response as any).task;
        } else {
          newTask = response as Task;
        }
        
        setTasks([...tasks, newTask]);
      }
      
      setTitle('');
      setDescription('');
      
      fetchTasks();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle task status update
  const handleStatusChange = async (taskId: string | number, newStatus: TaskStatus): Promise<void> => {
    try {
      const response = await tasksAPI.updateTaskStatus(taskId, newStatus);
      
      console.log('Status update response:', response);
      
      // Handle response format
      let updatedTask: Task;
      if (response && typeof response === 'object') {
        if ('data' in response) {
          updatedTask = (response as any).data;
        } else if ('task' in response) {
          updatedTask = (response as any).task;
        } else {
          updatedTask = response as Task;
        }
        
        console.log('Updated task:', updatedTask);
        
        setTasks(prevTasks =>
          prevTasks.map((task) =>
            task.id === taskId ? updatedTask : task
          )
        );
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to update task status. Please try again.');
    }
  };

  // Handle full task update (title, description, status)
  const handleTaskUpdate = async (taskId: string | number, title: string, description: string, status: TaskStatus): Promise<void> => {
    try {
      const response = await tasksAPI.updateTask(taskId, title, description, status);
      
      console.log('Full update response:', response);
      
      // Handle response format
      let updatedTask: Task;
      if (response && typeof response === 'object') {
        if ('data' in response) {
          updatedTask = (response as any).data;
        } else if ('task' in response) {
          updatedTask = (response as any).task;
        } else {
          updatedTask = response as Task;
        }
        
        console.log('Updated task from API:', updatedTask);
        
        setTasks(prevTasks =>
          prevTasks.map((task) =>
            task.id === taskId ? updatedTask : task
          )
        );
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to update task. Please try again.');
    }
  };

  // Handle task deletion
  const handleDelete = async (taskId: string | number): Promise<void> => {
    try {
      await tasksAPI.deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || 'Failed to delete task. Please try again.');
    }
  };

  // Handle logout
  const handleLogout = (): void => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Management of {userName}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Add Task Form */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task title"
                value={title}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter task description"
                value={description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Task'}
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Tasks</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 bg-white shadow rounded-lg">
              <p className="text-gray-600">No tasks yet. Create your first task above!</p>
            </div>
          ) : (
            <div>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasks;