const express = require('express');
const jwtVerification = require('../../middleware/jwt');

const {
  register,
  login,
  logout,
  changePassword,
  deleteUser,
  me,
} = require('../../controllers/users/user.auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// private routes
router.post('/change-password', jwtVerification, changePassword);
router.get('/logout', jwtVerification, logout);
router.get('/me', jwtVerification, me);

router.delete('/delete', deleteUser); // TODO: remove after development (if functionality required we can do soft delete)

module.exports = router;
