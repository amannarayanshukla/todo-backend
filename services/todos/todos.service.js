const { addTodo, getTodos, deleteTodoById, deleteAll, getTodoById, putTodoById } = require('../../dao/todos/todos.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');

const create = async (title, host, protocol) => {
  const id = uniqueIdentifier();
  const body = {
    todoId: id,
    title,
    url: `${protocol}://${host}/${id}`
  }
  const response = await addTodo(body).catch((err) => {
    console.log(err);
  });
  return response;
};

const get = async (filter, page = 1, limit=10) => {
  let response = await getTodos(filter, page, limit).catch((err) => {
    console.log(err);
  });
  response = response.docs;
  return response.docs && response.docs.length === 0 ? response.docs : response
};

const getOne = async (todoId) => {
  const response = await getTodoById(todoId).catch((err) => {
    console.log(err);
  });
  return response;
}

const archive = async (todoId) => {
  const response = await deleteTodoById(todoId).catch((err) => {
    console.log(err);
  });
  return response;
}

const archiveAll = async (query={}, options) => {
  console.log(query)
  if(!query.completed) {
    query = {};
  }
  const response = await deleteAll(query, options).catch((err) => {
    console.log(err)
  })
  return response;
}

const update = async (id, resource) => {
  const response = await putTodoById(id, resource).catch((err) => {
    console.log(err);
  });
  return response;
}

module.exports = {
  create,
  get,
  getOne,
  update,
  archive,
  archiveAll
};
