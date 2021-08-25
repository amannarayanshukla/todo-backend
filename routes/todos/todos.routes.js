const router = require('express').Router();
const { body, param, oneOf } = require('express-validator');

const { v4 } = require('uuid');
const {
  createTodo,
  getTodos,
  getTodosById,
  deleteTodosById,
  deleteTodos,
  updateTodos,
} = require('../../controllers/todos/todos.controller');

router.get('/', getTodos);
router.get(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  getTodosById,
);
router.post('/', body('title').trim().notEmpty().withMessage('title cannot be empty'), createTodo);
router.patch(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  oneOf([
    body('title').trim().notEmpty().withMessage('title cannot be empty'),
    body('order').trim().notEmpty().withMessage('order cannot be empty'),
    body('completed').trim().notEmpty().isBoolean()
      .withMessage('completed cannot be empty'),
  ]),
  updateTodos,
);
router.delete('/', deleteTodos);
router.delete(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  deleteTodosById,
);

module.exports = router;
