import express from 'express';

import boardApiController from "../controllers/boardApiController.js";

const router = express.Router();

router.get('/', boardApiController.showBoard);

export default router;