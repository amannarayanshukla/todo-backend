const { addTodo, getTodos } = require('../../dao/todos/todos.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');

const create = async ({title}) => {
  const body = { todoId: uniqueIdentifier(), title};
  const response = await addTodo(body).catch((err) => {
    console.log(err);
  });
  return response;
};

const get = async (filter, page = 1, limit=10) => {
  const response = await getTodos(filter, page, limit);
  return response;
};

module.exports = {
  create,
  get
};
