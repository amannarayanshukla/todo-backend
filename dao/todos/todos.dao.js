const Todos = require('../../models/todo/todo.model');
const crudRepository = require('../../repository/crud');

const addTodo = async (data) => {
  if (!data.order) {
    data.order = new Date().getTime();
  }
  return crudRepository.save(Todos, data);
};

const getTodos = async (filter, page, limit) => {
  if (typeof page === 'string' && typeof limit === 'string') {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
  }
  filter = { ...filter, archived: false };
  return crudRepository.find(Todos, filter, page, limit);
};

const getTodoById = async (todoId) => crudRepository.findOne(Todos, { todoId, archived: false });

const putTodoById = async (todoId, updatedDetails) => crudRepository.update(Todos, { todoId }, updatedDetails, {
  upsert: true,
});

const deleteTodoById = async (todoId) => crudRepository.update(Todos, { todoId }, { archived: true });

const deleteAll = async (query, options) => {
  const update = { archived: true };
  return crudRepository.updateAll(Todos, query, update, options);
};

module.exports = {
  addTodo,
  getTodos,
  getTodoById,
  putTodoById,
  deleteTodoById,
  deleteAll,
};
