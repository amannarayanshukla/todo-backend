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

const get = async (filter, page = 1, limit = 10, sortBy) => {
  let response = await getTodos(filter, page, limit, sortBy).catch((err) => {
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

const reoderDoc = async (todoToBeUpdated, up, down, userId) => {
  const newOrder = (up+down)/2;
  const newDoc = {...todoToBeUpdated,order: newOrder}
  const response = await putTodoById(userId, todoToBeUpdated.todoId, newDoc)
  return response;
}

const reorder = async (userId, upId, midId, downId) => {
  const data = [];
  data.push(getTodoById(userId,upId))
  data.push(getTodoById(userId,midId))
  data.push(getTodoById(userId,downId))

  let response = await Promise.all(data).catch(err => {
    console.log(err);
    throw new BadRequestError(`Error while ordering a todo ${err.status} ${err.message}`);
  });
  response = response.flat(1);
  const result = await reoderDoc(response[1],response[0].order, response[2].order, userId);
  return result;
}

module.exports = {
  create,
  get,
  getOne,
  update,
  archive,
  archiveAll,
  reorder
};
