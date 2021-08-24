const { create } = require('../../services/todos/todos.service');

const createTodo = async (req, res) => {
  const todoId = await create(req.body).catch((err) => {
    console.log(err);
  });
  return res.status(201).json({ success: true, message: '', todoId });
};

module.exports = {
  createTodo,
};
