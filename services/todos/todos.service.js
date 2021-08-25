const { addTodo, getTodos, deleteTodoById, deleteAll } = require('../../dao/todos/todos.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');

const create = async ({title}) => {
  const body = { todoId: uniqueIdentifier(), title};
  const response = await addTodo(body).catch((err) => {
    console.log(err);
  });
  return response;
};

const get = async (filter, page = 1, limit=10) => {
  const response = await getTodos(filter, page, limit).catch((err) => {
    console.log(err);
  });
  return response.docs;
};

const archive = async (todoId) => {
  const response = await deleteTodoById(todoId).catch((err) => {
    console.log(err);
  });
  return response;
}

const archiveAll = async (query={}, options) => {
  console.log(query)
  if(!query.isCompleted) {
    query = {};
  }
  const response = await deleteAll(query, options).catch((err) => {
    console.log(err)
  })
  return response;
}

module.exports = {
  create,
  get,
  archive,
  archiveAll
};
