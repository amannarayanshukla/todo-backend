const express = require('express');
const cors = require('cors');

const app = express();

const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health-check', (req, res) => {
  res.send('We are alive!!!');
});

app.use('/', (req, res) => {
  res.send(`Running on port ${port}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
