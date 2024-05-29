const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find({});
    console.log('Retrieved todos:', todos); // Logging retrieved todos
    res.json(todos);
  } catch (err) {
    console.error('Error retrieving todos:', err); // Logging error
    res.status(500).json({ message: err.message });
  }
});

// Create a new todo
router.post('/todos', async (req, res) => {
  const todo = new Todo({
    title: req.body.title,
    note: req.body.note
  });

  try {
    const newTodo = await todo.save();
    console.log('Created new todo:', newTodo); // Logging new todo
    res.status(201).json(newTodo);
  } catch (err) {
    console.error('Error creating todo:', err); // Logging error
    res.status(400).json({ message: err.message });
  }
});

// Update a todo
router.put('/todos/:id', async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      note: req.body.note
    }, { new: true });
    console.log('Updated todo:', updatedTodo); // Logging updated todo
    res.json({ message: 'Todo updated successfully', todo: updatedTodo });
  } catch (err) {
    console.error('Error updating todo:', err); // Logging error
    res.status(400).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    console.log('Deleted todo with ID:', req.params.id); // Logging deletion
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err); // Logging error
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
