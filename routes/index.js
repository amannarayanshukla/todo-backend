const router = require('express').Router();

const todoRoute = require('./todos/todos.routes');
const userRoute= require('./users/users.routes')

router.use('/user', userRoute);
router.use('/', todoRoute);
module.exports = router;
