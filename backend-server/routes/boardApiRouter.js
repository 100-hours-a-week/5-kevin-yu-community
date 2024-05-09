const express = require('express');

const boardApiController = require("../controllers/boardApiController.js");

const router = express.Router();

router.get('/', boardApiController.showBoard);

module.exports = router;