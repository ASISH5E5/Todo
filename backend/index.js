const path = require('path');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); 
const sequelize  = require('./connect');
const Todo = require('./models/Todo');
const aiRoutes = require('./routes/ai'); // ✅ AI route


const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database and sync models
sequelize.sync().then(() => {
  console.log('Database synced');
});

// Routes
app.use('/api', aiRoutes); // ✅ Mount /api/summarize route

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [['createdAt', 'DESC']] });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
console.log('OpenAI key:', process.env.OPENAI_API_KEY);

app.post('/todos', async (req, res) => {
  try {
    const { title, description, deadline, priority } = req.body;

    if (!title || !deadline) {
      return res.status(400).json({ error: 'Title and deadline are required' });
    }

    const todo = await Todo.create({
      title,
      description: description || '',
      deadline: new Date(deadline),
      priority: priority || 'medium',
      status: 'pending'
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/test-db', async (req, res) => {
  try {
    const [result] = await sequelize.query("SELECT 1+1 AS test");
    res.json({ database: "Working", result });
  } catch (err) {
    res.status(500).json({ database: "Failed", error: err.message });
  }
});

app.put('/todos/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.status = status;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/todos/:id/complete', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.status = 'completed';
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { title, description, deadline, priority, status } = req.body;
    const todo = await Todo.findByPk(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title;
    if (description !== undefined) todo.description = description;
    if (deadline !== undefined) todo.deadline = new Date(deadline);
    if (priority !== undefined) todo.priority = priority;
    if (status !== undefined) todo.status = status;

    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await todo.destroy();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/todos/stats', async (req, res) => {
  try {
    const [pending, progress, completed] = await Promise.all([
      Todo.count({ where: { status: 'pending' } }),
      Todo.count({ where: { status: 'progress' } }),
      Todo.count({ where: { status: 'completed' } })
    ]);

    res.json({
      pending,
      progress,
      completed,
      total: pending + progress + completed
    });
  } catch (error) {
    console.error('Error fetching todo stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.use(express.static(path.join(__dirname, '../app/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'app', 'build', 'index.html'));
});
// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
