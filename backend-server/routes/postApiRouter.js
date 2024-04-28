import express from 'express';

import postApiController from "../controllers/postApiController.js";

const router = express.Router();

// 게시글 등록
router.post('/', postApiController.addPost);

// 게시글 데이터 조회
router.get('/:no', postApiController.showPost);

// 게시글 수정
router.put('/:no', postApiController.editPost);

export default router;