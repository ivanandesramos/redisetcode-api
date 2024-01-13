const router = require('express').Router();

const { compiler } = require('./codelab.controller');

router.post('/compiler', compiler);

module.exports = router;
