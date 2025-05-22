const { DataTypes } = require('sequelize');
const { sequelize } = require('../connect');

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: ''
  },
  deadline: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Deadline must be a valid date'
      },
      isAfterToday(value) {
        if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error('Deadline cannot be in the past');
        }
      }
    }
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
    allowNull: false,
    validate: {
      isIn: {
        args: [['low', 'medium', 'high']],
        msg: 'Priority must be low, medium, or high'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'progress', 'completed'),
    defaultValue: 'pending',
    allowNull: false,
    validate: {
      isIn: {
        args: [['pending', 'progress', 'completed']],
        msg: 'Status must be pending, progress, or completed'
      }
    }
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'todos',
  indexes: [
    {
      fields: ['status']
    },
    {
      fields: ['deadline']
    },
    {
      fields: ['priority']
    }
  ],
  hooks: {
    beforeUpdate: (todo, options) => {
      if (todo.changed('status')) {
        if (todo.status === 'completed' && !todo.completedAt) {
          todo.completedAt = new Date();
        } else if (todo.status !== 'completed') {
          todo.completedAt = null;
        }
      }
    }
  }
});

// Instance methods
Todo.prototype.isOverdue = function() {
  if (this.status === 'completed') return false;
  return new Date(this.deadline) < new Date().setHours(0, 0, 0, 0);
};

Todo.prototype.getDaysUntilDeadline = function() {
  const deadline = new Date(this.deadline);
  const today = new Date().setHours(0, 0, 0, 0);
  const timeDiff = deadline - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

// Class methods
Todo.getPriorityOrder = function() {
  return {
    'high': 3,
    'medium': 2,
    'low': 1
  };
};

Todo.getStatusOrder = function() {
  return {
    'pending': 1,
    'progress': 2,
    'completed': 3
  };
};

module.exports = Todo;
