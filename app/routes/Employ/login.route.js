const express = require("express");

const router = express.Router();

const { Login } = require("../../controllers/Employ/login.controller");
const { ChangePassword } = require("../../controllers/Employ/login.controller");

router.post("/login", Login);
router.post("/change-password", ChangePassword);

module.exports = router;
