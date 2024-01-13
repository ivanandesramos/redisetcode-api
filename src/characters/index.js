const router = require('express').Router();

const charactersController = require('./characters.controller');
const { characterValidation } = require('./characters.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router
  .route('/')
  .get(charactersController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    characterValidation,
    validator,
    charactersController.create,
  );

router
  .route('/:id')
  .get(charactersController.getOne)
  .patch(isAuth, restrictTo('admin'), charactersController.update)
  .delete(isAuth, restrictTo('admin'), charactersController.delete);

module.exports = router;
