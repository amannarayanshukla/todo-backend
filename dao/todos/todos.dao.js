const Todos = require('../../models/todo/todo.model');
const crudRepository = require('../../repository/crud');

const addTodo = async (data) => {
  const todoDetails = { ...data };
  return crudRepository.save(Todos, todoDetails);
};

const getTodos = async (filter, page, limit) => {
  if (typeof page === 'string' && typeof limit === 'string') {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
  }

  return crudRepository.find(Todos, filter, page, limit);
};

const getTodoById = async (todoId) => crudRepository.findOne(Todos, { todoId });

const putTodoById = async (todoId, updatedDetails) => crudRepository.update(Todos, { todoId }, updatedDetails, {
  upsert: true,
});

const deleteTodoById = async (todoId) => crudRepository.delete(Todos, { todoId });

module.exports = {
  addTodo,
  getTodos,
  getTodoById,
  putTodoById,
  deleteTodoById,
};
