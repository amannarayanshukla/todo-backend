const {
  addTodo,
  getTodos,
  deleteTodoById,
  deleteAll,
  getTodoById,
  putTodoById,
} = require('../../dao/todos/todos.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const { asyncHandler } = require('../../utils/async-handler/async-handler');

const create = asyncHandler(async (title, order, host, protocol) => {
  const id = uniqueIdentifier();
  const body = {
    todoId: id,
    title,
    order,
    url: `${protocol}://${host}/${id}`,
  };
  const response = await addTodo(body).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while adding a todo ${err.status} ${err.message}`);
  });
  return response;
});

const get = asyncHandler(async (filter, page = 1, limit = 10) => {
  let response = await getTodos(filter, page, limit).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while getting all todos ${err.status} ${err.message}`);
  });
  response = response.docs;
  return response.docs && response.docs.length === 0 ? response.docs : response;
});

const getOne = asyncHandler(async (todoId) => {
  const response = await getTodoById(todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while getting a todo ${err.status} ${err.message}`);
  });
  return response;
});

const archive = asyncHandler(async (todoId) => {
  const response = await deleteTodoById(todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while deleting a todo ${err.status} ${err.message}`);
  });
  return response;
});

const archiveAll = asyncHandler(async (query = {}, options) => {
  if (!query.completed) {
    query = {};
  }
  const response = await deleteAll(query, options).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while deleting all todos ${err.status} ${err.message}`);
  });
  return response;
});

const update = asyncHandler(async (id, resource) => {
  const response = await putTodoById(id, resource).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while updating a todo ${err.status} ${err.message}`);
  });
  return response;
});

module.exports = {
  create,
  get,
  getOne,
  update,
  archive,
  archiveAll,
};
