const express = require('express');

const boardApiController = require("../controllers/boardApiController.js");
const checkLogin = require('../middlewares/checkLogin');

const router = express.Router();

router.get('/', checkLogin.isLoggedIn, boardApiController.showBoard);

module.exports = router;