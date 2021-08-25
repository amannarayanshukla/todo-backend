const { create, get, archive, archiveAll } = require('../../services/todos/todos.service');

const createTodo = async (req, res) => {
  const response = await create(req.body).catch((err) => {
    console.log(err);
  });
  return res.status(201).send(response);
};

const getTodos = async (req,res) => {
  const { page, limit, ...data } = req.query;
  const response = await get(data,page,limit).catch((err) => {
    console.log(err);
  });
  return res.send(response);
}

const deleteTodos = async (req,res) => {
  const { isCompleted, ...options } = req.query;
  const response = await archiveAll({isCompleted},options).catch((err) => {
    console.log(err);
  });
  return res.send(response);
}

const deleteTodosById = async (req,res) => {
  const {id:todoId} = req.params;
  const response = await archive(todoId).catch((err) => {
    console.log(err);
  });
  return res.send(response);
}

module.exports = {
  createTodo,
  getTodos,
  deleteTodosById,
  deleteTodos
};
