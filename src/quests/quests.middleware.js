const { body } = require('express-validator');
const Quest = require('./quest');

const questValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Quest name is required')
    .custom(async (val) => {
      const quest = await Quest.findOne({ name: val });
      if (quest) throw new Error('Quest already exists.');
      return true;
    }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Quest description is required'),
  body('time').trim().notEmpty().withMessage('Quest time is required'),
  body('passingScore')
    .trim()
    .notEmpty()
    .withMessage('Quest passing score is required'),
];

module.exports = {
  questValidation,
};
