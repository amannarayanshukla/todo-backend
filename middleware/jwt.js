const jwt = require('jsonwebtoken');

const { asyncHandler } = require('../utils/async-handler/async-handler');
const Users = require('../models/user/user.model');
const { getRedisKey, delRedisKey, setRedisKeyValue } = require('../utils/redis-crud/redis.crud');
const {BadRequestError} = require('../utils/errors/bad-request-error')

const timeDifference = parseInt(process.env.TIME_DIFFERENCE, 10);

const generateAndUpdateAccessToken = async (decoded) => {
  const response = await delRedisKey(decoded.userId).catch((err) => {
    throw Object({ status: 500, message: `Invalid access token. ${err.message}` });
  });
  if (response !== 1) {
    throw Object({ status: 500, message: 'Error please try again.' });
  }
  const user = await Users.findOne({ userId: decoded.userId }).select('email userId');
  const newAccessToken = user.createAccessToken();
  user.accessToken = newAccessToken;
  await user.save().catch((err) => {
    throw new BadRequestError(`Error while registration please try again. ${err.message}`);
  });
  await setRedisKeyValue(decoded.userId, newAccessToken).catch((err) => {
    throw new BadRequestError(`Error while setting token.. ${err.message}`);
  });
  return newAccessToken;
};

// check if the JWT is valid and also present in Redis
const jwtVerification = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (req.session) {
    accessToken = req.session.jwt;
  }
  let decoded;

  try {
    decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);
    const reply = await getRedisKey(decoded.userId).catch((err) => {
      throw Object({
        status: err.status || 401,
        message: `Invalid JWT token. ${err.message}`,
      });
    });
    if (!reply || reply !== accessToken) {
      throw Object({ status: 401, message: 'Invalid JWT token' });
    }

    const timeLeft = decoded.exp * 1000 - Date.now();
    if (timeLeft < timeDifference) {
      accessToken = await generateAndUpdateAccessToken(decoded).catch((err) => {
        throw Object({
          status: err.status || 401,
          message: `Invalid JWT token. ${err.message}`,
        });
      });
    }
    req.session = {
      jwt: accessToken,
    };
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res
      .status(err.status || 401)
      .json({ success: false, message: err.message || 'Invalid JWT token' });
  }
});

module.exports = jwtVerification;
