const router = require('express').Router();

const regionsController = require('./regions.controller');
const { regionValidation } = require('./regions.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router
  .route('/')
  .get(regionsController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    regionValidation,
    validator,
    regionsController.create,
  );

router
  .route('/:id')
  .get(isAuth, regionsController.getOne)
  .patch(isAuth, restrictTo('admin'), regionsController.update)
  .delete(isAuth, restrictTo('admin'), regionsController.delete);

module.exports = router;
