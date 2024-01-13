const { body } = require('express-validator');
const Region = require('./region');

const regionValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Region name is required')
    .custom(async (val) => {
      const region = await Region.findOne({ name: val });
      if (region) throw new Error('Region already exists.');
      return true;
    }),
  body('cover').trim().notEmpty().withMessage('Region cover is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Region description is required'),
];

module.exports = {
  regionValidation,
};
