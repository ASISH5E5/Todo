
import { User, Sun, Moon } from 'lucide-react';


const Navigation = ({ user, darkMode, onToggleDarkMode, onLogout }) => (
  <nav className={`shadow-sm border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Todo
        </h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
          >

            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="flex items-center space-x-2">
            <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {user?.name || 'User'}
            </span>
          </div>
          
        </div>
      </div>
    </div>
  </nav>
);

export default Navigation;