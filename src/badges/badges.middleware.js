const { body } = require('express-validator');
const Badge = require('./badge');

const badgeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Badge name is required')
    .custom(async (val) => {
      const badge = await Badge.findOne({ name: val });
      if (badge) throw new Error('Badge already exists.');
      return true;
    }),
  body('image').trim().notEmpty().withMessage('Badge image is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Badge description is required'),
];

module.exports = {
  badgeValidation,
};
