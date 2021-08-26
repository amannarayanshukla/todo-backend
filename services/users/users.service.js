const {
addUser,
  getUserById,
  getUsers,
  putUserById,
  deleteUserById
} = require('../../dao/users/users.dao');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const { asyncHandler } = require('../../utils/async-handler/async-handler');

const list = asyncHandler(async (filter, page, limit) => {
  const response = await getUsers(filter, page, limit).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while getting users ${err.status} ${err.message}`,
    );
  });
  return response;
});

const create = asyncHandler(async (resource) => {
  const body = { userId: uniqueIdentifier(), ...resource };
  const response = await addUser(body).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while creating a user ${err.status} ${err.message}`,
    );
  });
  return response.userId;
});

const listById = asyncHandler(async (id) => {
  const response = await getUserById(id).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while getting a user ${err.status} ${err.message}`,
    );
  });
  return response;
});

const putById = asyncHandler(async (id, resource) => {
  const response = await putUserById(id, resource).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while updating a user ${err.status} ${err.message}`,
    );
  });
  return response.userId;
});

const deleteById = asyncHandler(async (id) => {
  const res = await deleteUserById(id).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while deleting a user ${err.status} ${err.message}`,
    );
  });
  return id;
});

module.exports = {
  list,
  create,
  listById,
  putById,
  deleteById,
};