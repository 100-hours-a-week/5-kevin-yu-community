import express from 'express';

import boardController from '../controllers/boardController.js';

const router = express.Router();

router.get('/', boardController.showBoard);

export default router;