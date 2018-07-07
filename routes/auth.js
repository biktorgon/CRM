const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');

//localhost:5000/api/auth/login
router.post('/login', controller.login);
router.post('/register', controller.register);

module.exports = router;