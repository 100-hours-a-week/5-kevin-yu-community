import express from 'express';

import postController from '../controllers/postController.js';

const router = express.Router();

// 게시글 등록 폼 조회
router.get('/add-form', postController.showAddForm);

// 게시글 조회
router.get('/:no', postController.showPost);

// 게시글 수정 폼 조회
router.get('/:no/edit-form', postController.showEditForm);

// 게시글 수정 요청
router.put('/:no', postController.editPost);

export default router;