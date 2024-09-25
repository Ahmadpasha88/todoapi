const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const auth = require('../middleware/auth');
const router = express.Router();


router.post('/', auth, createTodo);  
router.get('/', auth, getTodos);      
router.put('/:id', auth, updateTodo); 
router.delete('/:id', auth, deleteTodo); 

module.exports = router;
