const router = require('express').Router();
const { body, param, oneOf } = require('express-validator');
const jwtVerification = require('../../middleware/jwt');
const {validateRequest} = require('../../middleware/validate-request')
const { v4 } = require('uuid');
const {
  createTodo,
  getTodos,
  getTodosById,
  deleteTodosById,
  deleteTodos,
  updateTodos,
} = require('../../controllers/todos/todos.controller');

// JWT verification before each call
router.use(jwtVerification);

router.get('/', getTodos);
router.get(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  validateRequest,
  getTodosById,
);
router.post('/', body('title').trim().notEmpty().withMessage('title cannot be empty'),validateRequest, createTodo);
router.patch(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  oneOf([
    body('title').trim().notEmpty().withMessage('title cannot be empty'),
    body('order').trim().notEmpty().withMessage('order cannot be empty'),
    body('completed').trim().notEmpty().isBoolean()
      .withMessage('completed cannot be empty'),
  ]),
  validateRequest,
  updateTodos,
);
router.delete('/', deleteTodos);
router.delete(
  '/:id',
  param('id').notEmpty().isUUID(v4).withMessage('please check the id passed'),
  validateRequest,
  deleteTodosById,
);

module.exports = router;
