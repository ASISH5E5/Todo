// components/MainPage.js
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { useApi } from '../utils/api';
import Navigation from '../utils/Nav';
import TaskFormModal from '../utils/TaskForm';
import TaskColumn from '../utils/TaskColumn';
import Sidebar from '../utils/SideBar';
import ErrorBanner from '../utils/Error';
import LoadingSpinner from '../utils/Loading';

const MainPage = ({ user, onLogout }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { apiCall } = useApi();
const [summary, setSummary] = useState('');
const [generatingSummary, setGeneratingSummary] = useState(false);

useEffect(() => {
  const generateSummary = async () => {
    if (todos.length === 0) return;

    setGeneratingSummary(true);
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todos }), // ✅ Should match backend
      });

      const data = await response.json();
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      setError('Failed to generate AI summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  generateSummary();
}, [todos]);


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await apiCall('/todos');
        setTodos(data || []);
      } catch (err) {
        if (err.message === 'Authentication failed') {
          onLogout();
          return;
        }
        setError('Failed to load todos. Please try again later.');
        console.error('Error fetching todos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [apiCall, onLogout]);

  const handleAddTask = async (newTask) => {
    if (!newTask.title.trim() || !newTask.deadline) {
      setError('Title and deadline are required');
      return;
    }
    
    try {
      const response = await apiCall('/todos', {
        method: 'POST',
        body: JSON.stringify(newTask)
      });

      setTodos(prev => [response, ...prev]);
      setShowTaskForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await apiCall(`/todos/${taskId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      setTodos(prev => prev.map(todo =>
        todo.id === taskId ? response : todo
      ));
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await apiCall(`/todos/${taskId}`, { method: 'DELETE' });
      setTodos(prev => prev.filter(todo => todo.id !== taskId));
    } catch (err) {
      setError('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData('status', task.status);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem(task.id);
    
    // Add drag start animation
    e.target.style.transform = 'rotate(5deg) scale(0.95)';
    e.target.style.opacity = '0.8';
    e.target.style.transition = 'all 0.2s ease';
    e.target.style.zIndex = '1000';
    e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.3)';
  };

  const handleDragEnd = (e) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    
    // Reset drag styles
    e.target.style.transform = '';
    e.target.style.opacity = '';
    e.target.style.transition = '';
    e.target.style.zIndex = '';
    e.target.style.boxShadow = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, status) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDragLeave = (e) => {
    // Only clear drag over if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const currentStatus = e.dataTransfer.getData('status');
    
    setDragOverColumn(null);
    setDraggedItem(null);

    if (taskId && currentStatus !== newStatus) {
      try {
        // Optimistically update UI before server confirms
        setTodos(prev => 
          prev.map(todo => 
            todo.id === parseInt(taskId)
              ? { ...todo, status: newStatus }
              : todo
          )
        );

        // Sync with backend
        await handleStatusChange(taskId, newStatus);
      } catch (err) {
        setError('Failed to update task status. Please try again.');
        console.error('Error updating task status:', err);
      }
    }
  };

  const getColumnTasks = (status) => todos.filter(todo => todo.status === status);

  const taskCounts = {
    pending: getColumnTasks('pending').length,
    progress: getColumnTasks('progress').length,
    completed: getColumnTasks('completed').length
  };

  if (loading) {
    return <LoadingSpinner darkMode={darkMode} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navigation 
        user={user} 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
        onLogout={onLogout} 
      />

      <ErrorBanner error={error} onDismiss={() => setError(null)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <Sidebar 
            darkMode={darkMode}
            onAddTaskClick={() => setShowTaskForm(true)}
            taskCounts={taskCounts}
          />
          <div>{summary && (
  <div className={`my-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
    <h2 className="text-lg font-semibold mb-2">📋 AI Summary</h2>
    {generatingSummary ? (
      <p>Generating summary...</p>
    ) : (
      <pre className="whitespace-pre-wrap text-sm">{summary}</pre>
    )}
  </div>
)}
</div>

          <div className="flex-1">
            <div className="grid grid-cols-3 gap-6">
              <TaskColumn
                title="Pending"
                icon={<Clock className="w-5 h-5 text-orange-500" />}
                tasks={getColumnTasks('pending')}
                status="pending"
                darkMode={darkMode}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggedItem={draggedItem}
                dragOverColumn={dragOverColumn}
                color="bg-orange-100 text-orange-800"
                borderColor="border-l-4 border-red-500"
              />
              <TaskColumn
                title="In Progress"
                icon={<div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>}
                tasks={getColumnTasks('progress')}
                status="progress"
                darkMode={darkMode}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggedItem={draggedItem}
                dragOverColumn={dragOverColumn}
                color="bg-blue-100 text-blue-800"
                borderColor="border-l-4 border-yellow-500"
              />
              <TaskColumn
                title="Completed"
                icon={<CheckCircle className="w-5 h-5 text-green-500" />}
                tasks={getColumnTasks('completed')}
                status="completed"
                darkMode={darkMode}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDeleteTask={handleDeleteTask}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                draggedItem={draggedItem}
                dragOverColumn={dragOverColumn}
                color="bg-green-100 text-green-800"
                borderColor="border-l-4 border-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      <TaskFormModal
        show={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleAddTask}
        darkMode={darkMode}
      />
     
      <style jsx>{`
        .drag-preview {
          transform: rotate(5deg) scale(0.95);
          opacity: 0.8;
          transition: all 0.2s ease-in-out;
          z-index: 1000;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        
        .drag-over {
          background-color: rgba(59, 130, 246, 0.1);
          border: 2px dashed #3b82f6;
          transform: scale(1.02);
          transition: all 0.2s ease-in-out;
        }
        
        .drag-ghost {
          opacity: 0.4;
          transform: scale(0.95);
          transition: all 0.2s ease-in-out;
        }
        
        .task-item {
          transition: all 0.2s ease-in-out;
        }
        
        .task-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        @keyframes dropSuccess {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .drop-success {
          animation: dropSuccess 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MainPage;