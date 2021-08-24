const environmentCheck = () => {
  if (!process.env.MONGODB_URL) {
    throw new Error('MONGODB URL not present in environment file');
  }
};

module.exports = { environmentCheck };
