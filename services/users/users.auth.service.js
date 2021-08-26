const { uniqueIdentifier } = require('../../utils/unique-identifier/index');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const Users = require('../../models/user/user.model');

const {
  addUser,
  getUserById,
  deleteUserByQuery,
} = require('../../dao/users/users.dao');

const {
  delRedisKey,
  setRedisKeyValue,
} = require('../../utils/redis-crud/redis.crud');


const registerUser = async (name, email, password) => {
  const userId = uniqueIdentifier();
  const user = {
    userId,
    name,
    email,
    password,
  };
  const response = await addUser(user).catch((err) => {
    if (err.code === 11000) {
      throw new BadRequestError(
        'A user with the email number already exists',
      );
    }
    throw new BadRequestError(`Error while registration please try again. ${err.message}`);
  });
  if (!response) {
    throw new BadRequestError(
      'Error while registering a new user',
    );
  }
  return {
    name: response.name,
    email: response.email,
    userId: response.userId,
  };
};

const loginUser = async (email, password ) => {
  let accessToken = null;
  let user = await Users.findOne({
    email,
  }).select('password userId');

  if (!user) {
    throw new BadRequestError(
      'Invalid credentials',
    );
  }

  const result = await user.comparePassword(password);

  if (!result) {
    throw new BadRequestError(
      'Invalid credentials',
    );
  }

  accessToken = await user.createAccessToken();

  user.accessToken = accessToken;
  user = await user.save();
  await setRedisKeyValue(user.userId, user.accessToken).catch((err) => {
    throw new BadRequestError(
      `Error while setting token. ${err.message}`      );
  });
  user.password = '';
  return {
    accessToken,
    user
  }
};

const logoutUser = async (userId) => {
  const user = await Users.findOne({ userId }).catch((err) => {
    console.log(err);
    throw new BadRequestError(
      `Error while getting a user ${err.status} ${err.message}`,
    );
  });
  user.accessToken = undefined;
  await user.save()
  // delete key from redis
  const response = await delRedisKey(userId).catch((err) => {
    throw new BadRequestError(
      `Error while logging out, ${err.message}`
    );
  });
  if (response !== 1) {
    throw new BadRequestError(
      `Error while logging out`
    );
  }
  return {
    accessToken: null
  }

};

const changePasswordUser = async (userId, newPassword, oldPassword) => {
  const user = await Users.findOne({ userId }).select('password userId');
  if (user) {
    const result = await user.comparePassword(oldPassword);

    if (!result) {
      throw new BadRequestError(
        'Invalid credentials',
      );
    }

    user.password = newPassword;
    user.accessToken = undefined;
    const userDoc = await user.save();

    // delete key from redis
    const response = await delRedisKey(userId).catch((err) => {
      throw new BadRequestError(
        `Error while logging out ${err.message}`
      )
    });
    if (response !== 1) {
      throw new BadRequestError(
        'Error while changing password out'
      );
    }
    userDoc.password = '';
    return {
      accessToken: null,
      userDoc
    }
  } else {
    throw new BadRequestError(
      'Invalid credentials',
    );
  }

};

// TODO:ONLY FOR TESTING REMOVE LATER
const deleteUserHard = async (email) => {
  const user = await deleteUserByQuery({ email }).catch((err) => {
    throw new BadRequestError(
      `Error while deleting user, ${err.message}`
    );
  });
  if(!user) {
    throw new BadRequestError(
      `Error while deleting user`
    );
  }
  return user;
};

const getDetails = async(userId) => {
  const user = await getUserById(userId).catch((err) => {
    throw new BadRequestError(
      `Error while finding user, ${err.message}`
    );
  });
  return user;
};

module.exports = {
  registerUser,
  logoutUser,
  loginUser,
  changePasswordUser,
  getDetails,
  deleteUserHard
}
