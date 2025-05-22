// components/TaskColumn.js
import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ 
  title, 
  icon, 
  tasks, 
  status, 
  darkMode, 
  onDrop, 
  onDragOver, 
  onDeleteTask, 
  onDragStart, 
  color 
}) => (

  <div>

     <div className={`flex items-center justify-between h-20 rounded-t-xl p-8  ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h2 className="text-lg font-semibold flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </h2>
      <span className={`${color} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
        {tasks.length}
      </span>
    </div>
  
  <div className={`rounded-b-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} h-[80vh] overflow-y-scroll`}>
   
    <div
      className="space-y-4 min-h-96  overflow-y-auto"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      {tasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onDragStart={onDragStart}
          darkMode={darkMode}
        />
      ))}
      {tasks.length === 0 && (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="w-8 h-8 mx-auto mb-2 opacity-50 flex items-center justify-center">
            {icon}
          </div>
          <p className="text-sm">No {title.toLowerCase()} tasks</p>
        </div>
      )}
      </div>
    </div>
  </div>
);

export default TaskColumn;