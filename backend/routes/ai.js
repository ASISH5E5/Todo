const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/summarize', async (req, res) => {
  if (!req.body || !req.body.todos) {
    return res.status(400).json({ error: "Request body must contain 'todos' array" });
  }

  try {
    const todos = req.body.todos;
    const todoText = todos
      .map((todo, i) => `${i + 1}. ${todo.title} - ${todo.status}`)
      .join('\n');

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an assistant that summarizes a todo list." },
        { role: "user", content: `Summarize the following todos:\n\n${todoText}` }
      ],
    });

    const summary = completion.choices[0]?.message?.content;
    res.json({ summary });
  } catch (err) {
    console.error('Full OpenAI error:', err.response?.data || err.message || err);
    res.status(500).json({
      error: 'AI processing failed',
      message: err.message,
      html: err.response?.data || null,
    });
  }
});

router.get('/test-ai', async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: 'Say hello in a short sentence' },
      ],
    });
    res.json(completion.choices[0].message);
  } catch (err) {
    res.status(500).json({ error: 'OpenAI test failed', details: err.message });
  }
});

module.exports = router;
