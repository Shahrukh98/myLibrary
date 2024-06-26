const express = require('express');
const router = express.Router();
const userController = require('./controllers/user');
const Auth = require('./middleware');

router.use('/users', userController);

module.exports = router;