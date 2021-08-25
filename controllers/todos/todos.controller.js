const { create, get, archive, archiveAll, getOne } = require('../../services/todos/todos.service');

const createTodo = async (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const response = await create(req.body.title, host, protocol).catch((err) => {
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

const getTodosById = async (req,res) => {
  const {id:todoId} = req.params;
  const response = await getOne(todoId).catch((err) => {
    console.log(err);
  });
  return res.send(response);
}

const deleteTodos = async (req,res) => {
  const { completed, ...options } = req.query;
  const response = await archiveAll({completed},options).catch((err) => {
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
  getTodosById,
  deleteTodosById,
  deleteTodos
};
