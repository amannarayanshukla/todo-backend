const { create, get } = require('../../services/todos/todos.service');

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

module.exports = {
  createTodo,
  getTodos
};
