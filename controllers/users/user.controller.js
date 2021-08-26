const { successResponseHandler } = require('../../utils/responses/success.response');
const {
  list,
  create,
  listById,
  putById,
  deleteById,
} = require('../../services/users/users.service');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const { asyncHandler } = require('../../utils/async-handler/async-handler');

const listUsers = asyncHandler(async (req, res) => {
  const users = await list(req.query, req.query.page, req.query.limit).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      'Error while getting list of users please try again.',
    );
  });
  return successResponseHandler(res, '', 200, users, true);
});

const createUser = asyncHandler(async (req, res) => {
  const userId = await create(req.body).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      'Error while creating new a user please try again.',
    );
  });
  return successResponseHandler(res, '', 201, userId, true);
});

const getUser= asyncHandler(async (req, res) => {
  const user = await listById(req.params.id).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while getting a user ${req.params.id} please try again.`,
    );
  });
  return successResponseHandler(res, '', 200, user, true);
});

const updateUser = asyncHandler(async (req, res) => {
  const userId = await putById(req.params.id, req.body).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while updating user ${req.params.id} please try again.`,
    );
  });
  return successResponseHandler(res, '', 200, userId, true);
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = await deleteById(req.params.id).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while deleting user ${req.params.id} please try again.`,
    );
  });
  return successResponseHandler(res, '', 200, userId, true);
});

module.exports = {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
};

