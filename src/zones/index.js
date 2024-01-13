const router = require('express').Router();

const zonesController = require('./zones.controller');
const { zoneValidation } = require('./zones.middleware');
const validator = require('../utils/validator.util');
const { isAuth, restrictTo } = require('../auth/auth.middleware');

router.get('/:regionId/zones', isAuth, zonesController.getZonesByRegion);

router
  .route('/')
  .get(isAuth, zonesController.getAll)
  .post(
    isAuth,
    restrictTo('admin'),
    zoneValidation,
    validator,
    zonesController.create,
  );

router
  .route('/:id')
  .get(isAuth, zonesController.getOne)
  .patch(isAuth, restrictTo('admin'), zonesController.update)
  .delete(isAuth, restrictTo('admin'), zonesController.delete);

module.exports = router;
