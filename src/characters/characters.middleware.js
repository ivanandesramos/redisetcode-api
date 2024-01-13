const { body } = require('express-validator');
const Character = require('./character');

const characterValidation = [
  // Validation rules for creating a character
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Character name is required')
    .custom(async (val) => {
      const character = await Character.findOne({ name: val });
      if (character) throw new Error('Character already exists.');
      return true;
    }),
  body('avatar').trim().notEmpty().withMessage('Character avatar is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Character description is required'),
];

module.exports = {
  characterValidation,
};
