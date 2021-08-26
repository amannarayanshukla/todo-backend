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

const create =async (title, order, host, protocol, userId) => {
  const id = uniqueIdentifier();
  const body = {
    todoId: id,
    title,
    order,
    userId,
    url: `${protocol}://${host}/${id}`,
  };
  const response = await addTodo(body).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while adding a todo ${err.status} ${err.message}`);
  });
  return response;
};

const get = async (filter, page = 1, limit = 10) => {
  let response = await getTodos(filter, page, limit).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while getting all todos ${err.status} ${err.message}`);
  });
  response = response.docs;
  return response.docs && response.docs.length === 0 ? response.docs : response;
};

const getOne = async (userId,todoId) => {
  const response = await getTodoById(userId,todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while getting a todo ${err.status} ${err.message}`);
  });
  return response;
};

const archive = async (userId,todoId) => {
  const response = await deleteTodoById(userId,todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while deleting a todo ${err.status} ${err.message}`);
  });
  if(!response) {
    throw new BadRequestError(`Error while deleting a todo`);
  }
  return response;
};

const archiveAll = async (query = {},userId, options) => {
  if (!query.completed) {
    query = {};
  }
  query.userId = userId;
  const response = await deleteAll(query, options).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while deleting all todos ${err.status} ${err.message}`);
  });
  return response;
};

const update = async (userId, id, resource) => {
  const response = await putTodoById(userId,id, resource).catch((err) => {
    console.log(err);
    throw new BadRequestError(`Error while updating a todo ${err.status} ${err.message}`);
  });
  return response;
};

module.exports = {
  create,
  get,
  getOne,
  update,
  archive,
  archiveAll,
};
