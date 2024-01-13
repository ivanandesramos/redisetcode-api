const router = require('express').Router();

const stagesController = require('./stages.controller');
const { stageValidation } = require('./stages.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router.get('/:zoneId/stages', isAuth, stagesController.getStagesByZone);
router.post('/:stageId/mark-as-done', isAuth, stagesController.markAsDone);

router
  .route('/')
  .get(isAuth, restrictTo('admin'), stagesController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    stageValidation,
    validator,
    stagesController.create,
  );

router
  .route('/:id')
  .get(isAuth, stagesController.getOne)
  .patch(isAuth, restrictTo('admin'), stagesController.update)
  .delete(isAuth, restrictTo('admin'), stagesController.delete);

module.exports = router;
