const { addTodo } = require('../../dao/todos/todos.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');

const create = async (data) => {
  const body = { todoId: uniqueIdentifier(), text: data };
  const response = await addTodo(body).catch((err) => {
    console.log(err);
  });
  return response.todoId;
};

module.exports = {
  create,
};
