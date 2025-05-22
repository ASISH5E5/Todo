// components/TaskCard.js
import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';

const TaskCard = ({ task, onDelete, onDragStart, darkMode }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (deadline, status) => {
    return new Date(deadline) < new Date() && status !== 'completed';
  };

  const isCompleted = task.status === 'completed';
  const inProgress = task.status === 'progress';

  return (
    <div
  className={`rounded-lg p-4 shadow cursor-move  dark:bg-gray-700 ${darkMode ? 'bg-black' : 'bg-white'} ${isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}  ${inProgress ? 'border-l-4 border-yellow-500' : ''}`}
  draggable
  onDragStart={(e) => onDragStart(e, task)}
>
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium text-sm ${isCompleted ? 'line-through ' : ''} ${darkMode ? 'text-white' : 'text-gray-600'}`}>
          {task.title}
        </h3>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className={`text-xs mb-3 ${isCompleted ? 'line-through' : ''} ${darkMode ? 'text-gray-600' : 'text-gray-600'}`}>
        {task.description || 'No description'}
      </p>
      <div className="flex justify-between items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${
          task.priority === 'high' ? 'bg-red-100 text-red-800' :
          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {task.priority}
        </span>
        <div className="flex items-center space-x-1">
          <Calendar size={12} className={isOverdue(task.deadline, task.status) ? 'text-red-500' : 'text-gray-400'} />
          <span className={`text-xs ${isOverdue(task.deadline, task.status) ? 'text-red-500' : 'text-gray-500'}`}>
            {formatDate(task.deadline)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;