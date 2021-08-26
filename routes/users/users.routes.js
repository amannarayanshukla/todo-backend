const express = require('express');
const { body, } = require('express-validator');
const jwtVerification = require('../../middleware/jwt');
const {validateRequest} = require('../../middleware/validate-request')

const {
  register,
  login,
  logout,
  changePassword,
  deleteUser,
  me,
} = require('../../controllers/users/user.auth');

const router = express.Router();
router.post('/register', body("name").trim().notEmpty().withMessage("name is required"),
  body("email").trim().notEmpty().isEmail().withMessage("please check the email"),
  body("password").trim().notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  validateRequest,
  register);
router.post('/login',
  body("email").trim().notEmpty().isEmail().withMessage("please check the email"),
  body("password").trim().notEmpty().withMessage("please check the password"),
  validateRequest,
  login);

// private routes
router.post('/change-password', jwtVerification,
  body("newPassword").trim().notEmpty().isStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }),
  validateRequest,
  changePassword);
router.get('/logout', jwtVerification, logout);
router.get('/me', jwtVerification, me);

router.delete('/delete', deleteUser); // TODO: remove after development (if functionality required we can do soft delete)

module.exports = router;
