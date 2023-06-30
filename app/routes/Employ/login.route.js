const express = require('express');
const router = express.Router();
const {Login,changePassword} = require('../../controllers/Employ/login.controller');

router.post('/login', Login);
router.post('/change-password', changePassword);

module.exports = router;
