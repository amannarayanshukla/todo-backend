const { successResponseHandler } = require('../../utils/responses/success.response');
const { BadRequestError } = require('../../utils/errors/bad-request-error');
const {asyncHandler} = require('../../utils/async-handler/async-handler')

const {
  registerUser,
  logoutUser,
  loginUser,
  changePasswordUser,
  getDetails,
  deleteUserHard
} = require('../../services/users/users.auth.service')

/**
 * @desc register a user
 * @route POST /api/v1/auth/register
 * @access Public
 */
const register = asyncHandler(async (req, res) => {
  const {
    name, email, password
  } = req.body;
  const response = await registerUser(name,email,password).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while registering new user please try again.');
  });
  return successResponseHandler(res, '', 201, response, true);

});

/**  @desc login a user
 *  @route POST /api/v1/auth/login
 *  @access Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { accessToken, user } = await loginUser(email,password).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while logging in user please try again.');
  });
    req.session = {
      jwt: accessToken,
    };
  return successResponseHandler(res, '', 200, user, true);

});

/**  @desc logout a user
 *  @route GET /api/v1/auth/logout
 *  @access private
 */
const logout = asyncHandler(async (req, res) => {
  const { userId } = req;
  const {accessToken} = await logoutUser(userId).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while logging out user please try again.');
  });
    req.session = {
      jwt: accessToken,
    };
    return successResponseHandler(res, '', 200, '', true);

});

/**
 * @desc change password for user
 *  @route POST /api/v1/auth/reset
 *  @access private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { userId } = req;
  const { newPassword, oldPassword } = req.body;
  const {
    accessToken,
      userDoc
  } = await changePasswordUser(userId,newPassword,oldPassword).catch((err) => {
    console.log(err);
    throw new BadRequestError('Error while changing user password please try again.');
  });

      req.session = {
        jwt: accessToken,
      };

      return successResponseHandler(res, '', 200, userDoc, true);


});

/**
 *  @desc delete user
 *  @route POST /api/v1/auth/delete
 *  @access public
 */
// ONLY FOR TESTING REMOVE LATER
const deleteUser = asyncHandler(async (req, res) => {
  const { email } = req.query;
  const user = await deleteUserHard(email).catch((err) => {
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
const me = asyncHandler(async (req, res) => {
  const { userId } = req;
    const user = await getDetails(userId).catch((err) => {
      throw new BadRequestError(
        `Error while finding user, ${err.message}`
      );
    });
    return successResponseHandler(res, '', 200, user, true);
});

module.exports = {
  register,
  login,
  logout,
  changePassword,
  deleteUser,
  me
}
