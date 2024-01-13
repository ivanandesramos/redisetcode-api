const router = require('express').Router();

const eventsController = require('./event.controller');
// const { isAuth } = require('../auth/auth.middleware');

router.get('/', eventsController.getEvent);

module.exports = router;
