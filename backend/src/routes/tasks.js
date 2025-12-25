const express = require('express');
const router = express.Router();

const tasks = [
  { id: 1, title: 'Buy groceries', completed: false, dueDate: '2025-12-28' },
  { id: 2, title: 'Walk the dog', completed: true, dueDate: '2025-12-25' },
  { id: 3, title: 'Write progress backend', completed: false, dueDate: '2026-01-05' }
];

router.get('/', (req, res) => {
  res.json(tasks);
});

module.exports = router;
