const Todos = require('../../models/todo/todo.model');
const crudRepository = require('../../repository/crud');
const { asyncHandler } = require('../../utils/async-handler/async-handler');

const addTodo = asyncHandler(async (data) => {
  if (!data.order) {
    data.order = new Date().getTime();
  }
  return crudRepository.save(Todos, data);
});

const getTodos = asyncHandler(async (filter, page, limit) => {
  if (typeof page === 'string' && typeof limit === 'string') {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
  }
  filter = { ...filter, archived: false };
  return crudRepository.find(Todos, filter, page, limit);
});

const getTodoById = asyncHandler(async (todoId) => crudRepository.findOne(Todos, { todoId, archived: false }));

const putTodoById = asyncHandler(async (todoId, updatedDetails) => crudRepository.update(Todos, { todoId }, updatedDetails, {
  upsert: true,
}));

const deleteTodoById = asyncHandler(async (todoId) => crudRepository.update(Todos, { todoId }, { archived: true }));

const deleteAll = asyncHandler(async (query, options) => {
  const update = { archived: true };
  return crudRepository.updateAll(Todos, query, update, options);
});

module.exports = {
  addTodo,
  getTodos,
  getTodoById,
  putTodoById,
  deleteTodoById,
  deleteAll,
};
