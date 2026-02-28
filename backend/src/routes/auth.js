const express = require('express');
const router = express.Router();

// Get admin password from environment variable
const adminPassword = process.env.ADMIN_PASSWORD;

// Simple in-memory user store
const users = [
  { id: 1, username: 'admin', password: adminPassword }
];

// Simple in-memory session store
const sessions = new Map();

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create a simple session token
  const token = Math.random().toString(36).substr(2) + Date.now().toString(36);
  sessions.set(token, { userId: user.id, username: user.username });

  res.json({
    token,
    user: { id: user.id, username: user.username }
  });
});

router.post('/logout', (req, res) => {
  const token = req.body?.token;
  if (token) {
    sessions.delete(token);
  }
  res.json({ success: true });
});

router.post('/verify', (req, res) => {
  const token = req.body?.token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  res.json({
    valid: true,
    user: { id: session.userId, username: session.username }
  });
});

module.exports = router;
