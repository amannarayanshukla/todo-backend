const {
  create,
  get,
  archive,
  archiveAll,
  getOne,
  update,
} = require('../../services/todos/todos.service');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const { asyncHandler } = require('../../utils/async-handler/async-handler');

const createTodo = asyncHandler(async (req, res) => {
  const { protocol, userId } = req;
  const host = req.get('host');
  const response = await create(req.body.title, req.body.order, host, protocol, userId).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while creating new todo please try again.');
  });
  return res.status(201).send(response);
});

const getTodos = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { page, limit, ...data } = req.query;
  data.userId = userId
  const response = await get(data, page, limit).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while getting all todos please try again.');
  });
  return res.send(response);
});

const getTodosById = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { id: todoId } = req.params;
  const response = await getOne(userId,todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while creating a todo ${todoId} please try again.`);
  });
  return res.send(response);
});

const deleteTodos = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { completed, ...options } = req.query;
  const response = await archiveAll({ completed }, userId,options).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while deleting all todos please try again.');
  });
  return res.send(response);
});

const deleteTodosById = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { id: todoId } = req.params;
  const response = await archive(userId,todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while deleting a todo ${todoId} please try again.`);
  });
  return res.send(response);
});

const updateTodos = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { id } = req.params;
  const response = await update(userId,id, req.body).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while updating a todo ${id} please try again.`);
  });
  return res.send(response);
});

module.exports = {
  createTodo,
  getTodos,
  getTodosById,
  updateTodos,
  deleteTodosById,
  deleteTodos,
};
