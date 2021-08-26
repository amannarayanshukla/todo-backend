const util = require('util');

const {redisService:client} = require('../../config/database');

const getRedisKey = (key) => {
  const getKey = util.promisify(client.get).bind(client);
  return getKey(key);
};

const delRedisKey = (key) => {
  const delKey = util.promisify(client.del).bind(client);
  return delKey(key);
};

const setRedisKeyValue = (key, value) => {
  const setKeyValue = util.promisify(client.set).bind(client);
  return setKeyValue(key, value);
};

module.exports = {
  getRedisKey,
  delRedisKey,
  setRedisKeyValue,
};
