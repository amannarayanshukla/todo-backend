const { successResponseHandler } = require('../../utils/responses/success.response');
const { uniqueIdentifier } = require('../../utils/unique-identifier/index');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const {asyncHandler} = require('../../utils/async-handler/async-handler')
const {
  delRedisKey,
  setRedisKeyValue,
} = require('../../utils/redis-crud/redis.crud');

const Users = require('../../models/user/user.model');

/**
 * @desc register a user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = asyncHandler(async (req, res) => {
  const {
    name, email, password
  } = req.body;
    const userId = uniqueIdentifier();
    const user = new Users({
      userId,
      name,
      email,
      password,
    });

    const userData = await user.save().catch((err) => {
      if (err.code === 11000) {
        throw new BadRequestError(
          'A user with the email number already exists',
        );
      }
      throw new BadRequestError(
        `Error while registration please try again. ${err.message}`      );
    });
    const { _doc: userDoc } = userData;

    if (!userDoc) {
      throw new BadRequestError(
        'Error while registering a new user',
      );
    }
    const data = {
      name: userDoc.name,
      email: userDoc.email,
      userId: userDoc.userId,
    }
    return successResponseHandler(res, '', 200, data, true);
});

/**  @desc login a user
 *  @route POST /api/v1/auth/login
 *  @access Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
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
    user = await user.save();
    await setRedisKeyValue(user.userId, accessToken).catch((err) => {
      throw new BadRequestError(
        `Error while setting token. ${err.message}`      );
    });
    req.session = {
      jwt: accessToken,
    };
    user.password = '';
  return successResponseHandler(res, '', 200, user, true);

});

/**  @desc logout a user
 *  @route GET /api/v1/auth/logout
 *  @access private
 */
exports.logout = asyncHandler(async (req, res) => {
  const { userId } = req;
    const user = await Users.findOne({ userId });
    user.accessToken = undefined;
    await user.save().catch((err) => {
      throw new BadRequestError(
        `Error while logging out, ${err.message}`
      );
    });
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
    req.session = {
      jwt: null,
    };
    return successResponseHandler(res, '', 200, '', true);

});

/**
 * @desc change password for user
 *  @route POST /api/v1/auth/reset
 *  @access private
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { newPassword, oldPassword } = req.body;
    const user = await Users.findOne({ userId }).select('password userId');
    if (user) {
      const result = await user.comparePassword(oldPassword);

      if (!result) {
        throw new BadRequestError(
          'Invalid credentials',
        );       }

      user.password = newPassword;
      user.accessToken = undefined;
      const userDoc = await user.save();
      req.session = {
        jwt: null,
      };
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
      return successResponseHandler(res, '', 200, userDoc, true);
    } else {
      throw new BadRequestError(
        'Invalid credentials',
      );
    }

});

/**
 *  @desc delete user
 *  @route POST /api/v1/auth/delete
 *  @access public
 */
// ONLY FOR TESTING REMOVE LATER
exports.deleteUser = asyncHandler(async (req, res) => {
  const { email } = req.query;
    const user = await Users.deleteOne({ email }).catch((err) => {
      throw new BadRequestError(
        `Error while deleting, ${err.message}`
      );
    });
    return successResponseHandler(res, '', 200, user, true);
});

/**
 *  @desc get user details
 *  @route POST /api/v1/auth/me
 *  @access private
 */
exports.me = asyncHandler(async (req, res) => {
  const { userId } = req;
    const user = await Users.findOne({ userId }).catch((err) => {
      throw new BadRequestError(
        `Error while finding user, ${err.message}`
      );
    });
    return successResponseHandler(res, '', 200, user, true);

});
