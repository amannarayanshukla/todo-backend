const router = require('express').Router();

const todoRoute = require('./todos/todos.routes');

router.use('/', todoRoute);

module.exports = router;
