const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    note: req.body.note
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      note: req.body.note
    }, { new: true });
    res.json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
