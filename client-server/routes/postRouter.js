import express from 'express';

import postController from '../controllers/postController.js';

const router = express.Router();

router.get('/:no', postController.showPost);

export default router;