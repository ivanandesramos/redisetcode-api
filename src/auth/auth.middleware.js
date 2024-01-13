const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const User = require('../users/user');
const Character = require('../characters/character');

const catchAsync = require('../utils/catchAsync.util');
const AppError = require('../utils/appError.util');

exports.isAuth = catchAsync(async (req, res, next) => {
  // Getting token and check if it's there
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  // Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

exports.loginValidation = [
  body('email').notEmpty().withMessage('Email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

exports.signupValidation = [
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
  body('characterId')
    .notEmpty()
    .withMessage('Character ID is required.')
    .custom(async (val) => {
      const character = await Character.findById(val);
      if (!character) throw new Error('No character found.');
      return true;
    }),
];
