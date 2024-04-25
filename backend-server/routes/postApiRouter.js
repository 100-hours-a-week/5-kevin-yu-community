import express from 'express';

import boardApiController from "../controllers/postApiController.js";

const router = express.Router();

router.get('/', boardApiController.showPost);

export default router;