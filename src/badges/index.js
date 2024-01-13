const router = require('express').Router();

const badgesController = require('./badges.controller');
const { badgeValidation } = require('./badges.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router
  .route('/')
  .get(badgesController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    badgeValidation,
    validator,
    badgesController.create,
  );

router
  .route('/:id')
  .get(badgesController.getOne)
  .patch(isAuth, restrictTo('admin'), badgesController.update)
  .delete(isAuth, restrictTo('admin'), badgesController.delete);

module.exports = router;
