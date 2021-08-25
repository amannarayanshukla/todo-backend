const router = require('express').Router();
const { createTodo, getTodos } = require('../../controllers/todos/todos.controller');

router.get('/', getTodos)
router.post('/', createTodo);

module.exports = router;
