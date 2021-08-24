const express = require('express');
const cors = require('cors');
const path = require('path');

const { environmentCheck } = require('./config/environment-check');
const { connect } = require('./config/database');

require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// environment check
environmentCheck();

// connect the database
connect()
  .then(() => console.log('connected to db')) // will replace all console log with application logger
  .catch((err) => console.log('error connecting to db', err.message));

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// this is a simple route to make sure everything is working properly
const runningMessage = `We are alive! At http://localhost:${port}`;
app.get('/health-check', (req, res) => res.status(200).send(runningMessage));

app.use('/', (req, res) => {
  res.send(`Running on port ${port}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
