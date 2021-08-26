const Users = require('../../models/user/user.model');
const crudRepository = require('../../repository/crud');

const addUser = async (data) => {
  const userDetails = { ...data };
  return crudRepository.save(Users, userDetails);
};

const getUsers = async (filter, page, limit) => {
  if (typeof page === 'string' && typeof limit === 'string') {
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
  }

  return crudRepository.paginate(Users, filter, page, limit);
};

const getUserById = async (userId) => crudRepository.findOne(Users, { userId });

const putUserById = async (userId, user) => crudRepository.update(Users, { userId }, user, {
  upsert: true,
});

const deleteUserById = async (userId) => crudRepository.delete(Users, { userId });

module.exports = {
  addUser,
  getUsers,
  getUserById,
  putUserById,
  deleteUserById
};
