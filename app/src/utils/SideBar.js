// components/Sidebar.js
import React from 'react';
import { Plus } from 'lucide-react';

const Sidebar = ({ darkMode, onAddTaskClick, taskCounts }) => (
  <div className="w-1/4">
    <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <button
        onClick={onAddTaskClick}
        className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center space-x-2"
      >
        <Plus size={20} />
        <span>Add New Task</span>
      </button>
      
      <div className="mt-6 space-y-4">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="font-medium mb-2">Task Overview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pending</span>
              <span className="font-medium text-orange-500">{taskCounts.pending}</span>
            </div>
            <div className="flex justify-between">
              <span>In Progress</span>
              <span className="font-medium text-blue-500">{taskCounts.progress}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed</span>
              <span className="font-medium text-green-500">{taskCounts.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;