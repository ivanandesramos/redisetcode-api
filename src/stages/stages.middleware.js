const { body } = require('express-validator');
const Stage = require('./stage');
const Zone = require('../zones/zone');

const stageValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Stage name is required')
    .custom(async (val) => {
      const stage = await Stage.findOne({ name: val });
      if (stage) throw new Error('Stage already exists.');
      return true;
    }),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Stage description is required'),
  body('content').trim().notEmpty().withMessage('Stage content is required'),
  body('stageNumber')
    .trim()
    .notEmpty()
    .withMessage('Stage number is required')
    .custom(async (val) => {
      const stage = await Stage.findOne({ stageNumber: val });
      if (stage) throw new Error('Stage number already exists.');
      return true;
    }),
  body('zone')
    .trim()
    .notEmpty()
    .withMessage('Stage must belong to a Zone')
    .custom(async (val) => {
      const zone = await Zone.findById(val);
      if (!zone) throw new Error('Invalid zone');
      return true;
    }),
];

module.exports = {
  stageValidation,
};
