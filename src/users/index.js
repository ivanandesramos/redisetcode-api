const router = require('express').Router();

const usersController = require('./users.controller');
const { userValidation } = require('./users.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router.get('/profile/:username', isAuth, usersController.getByUsername);
router.get('/leaderboard', usersController.leaderboard);

router
  .route('/')
  .get(isAuth, restrictTo('admin'), usersController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    userValidation,
    validator,
    usersController.create,
  );

router
  .route('/:id')
  .get(usersController.getOne)
  .patch(isAuth, restrictTo('admin'), usersController.update)
  .delete(isAuth, restrictTo('admin'), usersController.delete);

module.exports = router;
