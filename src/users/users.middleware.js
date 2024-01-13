const { body } = require('express-validator');

const User = require('./user');

const userValidation = [
  body('username')
    .trim()
    .blacklist(' ')
    .notEmpty()
    .withMessage('Username is required.')
    .bail()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long.')
    .customSanitizer((val) => {
      if (val) return val.toLowerCase();
    })
    .custom(async (val) => {
      const user = await User.findOne({ username: val });
      if (user) throw new Error('Username already exist.');
      return true;
    }),
  body('email')
    .trim()
    .blacklist(' ')
    .notEmpty()
    .withMessage('Email is required.')
    .bail()
    .customSanitizer((val) => {
      if (val) return val.toLowerCase();
    })
    .isEmail()
    .withMessage('Invalid email format.')
    .custom(async (val) => {
      const user = await User.findOne({ email: val });
      if (user) throw new Error('Email already exist.');
      return true;
    }),
  body('password')
    .trim()
    .blacklist(' ')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.'),
];

module.exports = {
  userValidation,
};
