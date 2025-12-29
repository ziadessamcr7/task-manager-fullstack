import { ChangeEvent, useState, FormEvent, useEffect } from 'react';
import { Task, TaskStatus } from '../types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string | number, status: TaskStatus) => void;
  onUpdate?: (taskId: string | number, title: string, description: string, status: TaskStatus) => void;
  onDelete: (taskId: string | number) => void;
}

const TaskItem = ({ task, onStatusChange, onUpdate, onDelete }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(task.title);
  const [editDescription, setEditDescription] = useState<string>(task.description);
  const [editStatus, setEditStatus] = useState<TaskStatus>(task.status);

  // Update local state when task prop changes
  useEffect(() => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status);
  }, [task.title, task.description, task.status]);

  // Handle status change
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    onStatusChange(task.id, newStatus);
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset values to current task values
      setEditTitle(task.title);
      setEditDescription(task.description);
      setEditStatus(task.status);
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onUpdate && editTitle.trim()) {
      onUpdate(task.id, editTitle.trim(), editDescription, editStatus);
      setIsEditing(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  // Get status badge color based on status
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      {isEditing ? (
        // Edit Mode
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label htmlFor={`edit-title-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id={`edit-title-${task.id}`}
              type="text"
              required
              value={editTitle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor={`edit-description-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id={`edit-description-${task.id}`}
              rows={3}
              value={editDescription}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor={`edit-status-${task.id}`} className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id={`edit-status-${task.id}`}
              value={editStatus}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setEditStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleEditToggle}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        // View Mode - Now uses task prop directly
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {task.title}
            </h3>
            <p className="text-gray-600 mb-3">{task.description || <span className="text-gray-400 italic">No description</span>}</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label htmlFor={`status-${task.id}`} className="text-sm font-medium text-gray-700">
                  Status:
                </label>
                <select
                  id={`status-${task.id}`}
                  value={task.status}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  task.status
                )}`}
              >
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              {task.createdAt && (
                <span className="text-xs text-gray-500">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleEditToggle}
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;