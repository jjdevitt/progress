const express = require('express');
const router = express.Router();

const tasks = [
  { id: 1, title: 'Buy groceries', completed: false, dueDate: '2025-12-28' },
  { id: 2, title: 'Walk the dog', completed: true, dueDate: '2025-12-25' },
  { id: 3, title: 'Write progress backend', completed: false, dueDate: '2026-01-05' }
];

router.get('/', (req, res) => {
  console.log('Fetching all tasks');
  res.json(tasks);
});

// Create a new task (in-memory)
router.post('/', (req, res) => {
  const { title, dueDate, completed } = req.body || {};
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'title is required' });
  }
  const maxId = tasks.reduce((m, t) => Math.max(m, t.id), 0);
  const newTask = {
    id: maxId + 1,
    title: title,
    completed: !!completed,
    dueDate: dueDate || null
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Partial update of a task (supports toggling `completed`)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: 'not found' });
  const { title, dueDate, completed } = req.body || {};
  if (title !== undefined) task.title = title;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (completed !== undefined) task.completed = !!completed;
  res.json(task);
});

module.exports = router;
