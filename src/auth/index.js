const router = require('express').Router();

const authController = require('./auth.controller');
const { loginValidation, signupValidation } = require('./auth.middleware');
const validator = require('../utils/validator.util');

router.post('/login', loginValidation, validator, authController.login);
router.post('/signup', signupValidation, validator, authController.signup);

module.exports = router;
