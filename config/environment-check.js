const environmentCheck = () => {
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB URL not present in environment file');
  } else if (!process.env.ACCESS_TOKEN_SECRET_KEY) {
    throw new Error('ACCESS TOKEN SECRET KEY not present in environment file');
  } else if (!process.env.ACCESS_TOKEN_EXPIRES_IN) {
    throw new Error('ACCESS TOKEN EXPIRES IN not present in environment file');
  } else if (!process.env.REDIS_PORT) {
    throw new Error('REDIS PORT not present in environment file');
  }  else if (!process.env.REDIS_HOST) {
    throw new Error('REDIS HOST not present in environment file');
  }  else if (!process.env.REDIS_PASSWORD) {
    throw new Error('REDIS PASSWORD not present in environment file');
  }  else if (!process.env.TIME_DIFFERENCE) {
    throw new Error('TIME DIFFERENCE not present in environment file');
  }
};

module.exports = { environmentCheck };
