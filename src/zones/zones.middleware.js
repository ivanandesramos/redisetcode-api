const { body } = require('express-validator');
const Zone = require('./zone');
const Region = require('../regions/region');

const zoneValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Zone name is required')
    .custom(async (val) => {
      const zone = await Zone.findOne({ name: val });
      if (zone) throw new Error('Zone already exists.');
      return true;
    }),
  body('cover').trim().notEmpty().withMessage('Zone cover is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Zone description is required'),
  body('region')
    .trim()
    .notEmpty()
    .withMessage('Zone must belong to a Region')
    .custom(async (val) => {
      const region = await Region.findById(val);
      if (!region) throw new Error('Invalid region');
      return true;
    }),
];

module.exports = {
  zoneValidation,
};
