const router = require('express').Router();
const { createTodo, getTodos, deleteTodosById, deleteTodos } = require('../../controllers/todos/todos.controller');

router.get('/', getTodos)
router.post('/', createTodo);
router.delete('/', deleteTodos);
router.delete('/:id', deleteTodosById);

module.exports = router;
