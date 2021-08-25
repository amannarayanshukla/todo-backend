const express = require('express');
const cors = require('cors');
const path = require('path');

const {errorHandler} = require('./middleware/error-handler');
const {NotFoundError} = require('./utils/errors/not-found-error')
const { environmentCheck } = require('./config/environment-check');
const { connect } = require('./config/database');
const routes = require('./routes');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// environment check
environmentCheck();

// connect the database
try {
  connect()
      .then(() => console.log('connected to db')) // will replace all console log with application logger
      .catch((err) => console.log('error connecting to db', err.message));

} catch (e) {
  console.log("Error db")
}

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is a simple route to make sure everything is working properly
const runningMessage = `We are alive! At http://localhost:${port}`;
app.get('/health-check', (req, res) => res.status(200).send(runningMessage));

app.use('/', routes);

app.all('*', () => {
  throw new NotFoundError();
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
