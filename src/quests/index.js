const router = require('express').Router();

const questsController = require('./quests.controller');
const { questValidation } = require('./quests.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router.get('/get', isAuth, questsController.getQuests);
router.post('/:questId/submit', isAuth, questsController.submitAnswer);
router.get('/:questId/result', isAuth, questsController.viewResult);

router
  .route('/')
  .get(isAuth, questsController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    questValidation,
    validator,
    questsController.create,
  );

router
  .route('/:id')
  .get(isAuth, questsController.getOne)
  .patch(isAuth, restrictTo('admin'), questsController.update)
  .delete(isAuth, restrictTo('admin'), questsController.delete);

module.exports = router;
