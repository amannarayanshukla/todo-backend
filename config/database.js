const mongoose = require('mongoose');

const { DatabaseConnectionError } = require('../utils/errors/database-connection-error');

const connect = () => {
  const mongoUrl = process.env.MONGODB_URL;
  const connectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    poolSize: 10,
    useFindAndModify: false,
    useCreateIndex: true,
    authSource: 'admin',
  };
  mongoose.connect(mongoUrl, connectionOptions);
  const { connection } = mongoose;
  return new Promise((resolve, reject) => {
    connection.once('open', () => {
      console.log('Mongoose connection open');
      resolve();
    });

    connection.on('error', (err) => {
      err = new DatabaseConnectionError();
      reject(err);
    });
  });
};

module.exports = { connect };
