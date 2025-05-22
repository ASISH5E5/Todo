// server/routes/ai.js
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post('/summarize', async (req, res) => {
  const { todos } = req.body;

  if (!Array.isArray(todos)) {
    return res.status(400).json({ error: 'Invalid todos format' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a productivity assistant that summarizes tasks by category: completed, in progress, and pending.',
        },
        {
          role: 'user',
          content: `Here are the tasks: ${JSON.stringify(todos)}. Please summarize them by status.`,
        },
      ],
    });

    const summary = response.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;
