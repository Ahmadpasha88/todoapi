const Todo = require('../models/todoModel');


const createTodo = async (req, res) => {
    const {title} = req.body;
    const userId = req.user.id; // Access userId from req.user

    if (!title) {
        return res.status(400).json({ error: 'Title are required' });
    }

    try {
        const newTodo = await Todo.create(title, userId); // Make sure your Todo model handles this
        res.status(201).json(newTodo);
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Error creating todo' });
    }
};


const getTodos = async (req, res) => {
  const userId = req.user.id;

  try {
    const todos = await Todo.findByUserId(userId);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching todos' });
  }
};

const updateTodo = async (req, res) => {
  const todoId = req.params.id;
  const { title, status } = req.body;

  if (!todoId) {
    return res.status(400).json({ error: 'Todo id are required' });
}

  try {
    const updatedTodo = await Todo.update(todoId, title, status);
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Error updating todo' });
  }
};

const deleteTodo = async (req, res) => {
  const todoId = req.params.id;

  try {
    const result = await Todo.delete(todoId);
    if (result.deleted) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Todo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting todo' });
  }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
