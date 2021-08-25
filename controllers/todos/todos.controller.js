const { create, get, archive, archiveAll, getOne, update } = require('../../services/todos/todos.service');
const {BadRequestError} = require('../../utils/errors/bad-request-error');

const createTodo = async (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const response = await create(req.body.title,req.body.order, host, protocol).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        'Error while creating new todo please try again.',
    );
  });
  return res.status(201).send(response);
};

const getTodos = async (req,res) => {
  const { page, limit, ...data } = req.query;
  const response = await get(data,page,limit).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        'Error while getting all todos please try again.',
    );
  });
  return res.send(response);
}

const getTodosById = async (req,res) => {
  const {id:todoId} = req.params;
  const response = await getOne(todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        `Error while creating a todo ${todoId} please try again.`,
    );
  });
  return res.send(response);
}

const deleteTodos = async (req,res) => {
  const { completed, ...options } = req.query;
  const response = await archiveAll({completed},options).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        'Error while deleting all todos please try again.',
    );
  });
  return res.send(response);
}

const deleteTodosById = async (req,res) => {
  const {id:todoId} = req.params;
  const response = await archive(todoId).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        `Error while deleting a todo ${todoId} please try again.`,
    );
  });
  return res.send(response);
}

const updateTodos = async (req,res) => {
  const {id} = req.params;
  const response = await update(id, req.body).catch((err) => {
    console.log(err);
    throw new BadRequestError(
        `Error while updating a todo ${id} please try again.`,
    );
  });
  return res.send(response);
}

module.exports = {
  createTodo,
  getTodos,
  getTodosById,
  updateTodos,
  deleteTodosById,
  deleteTodos
};
