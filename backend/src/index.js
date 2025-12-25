const express = require('express');
const tasksRouter = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => res.json({ message: 'Progress Backend API' }));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
