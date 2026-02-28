require('dotenv').config();

const express = require('express');
const path = require('path');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '..', 'public');
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Serve frontend static assets
app.use(express.static(publicPath));

// Serve index.html for non-API routes (SPA fallback)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
