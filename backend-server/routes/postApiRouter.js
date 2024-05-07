import express from 'express';

import postApiController from "../controllers/postApiController.js";

const router = express.Router();

// 게시글 등록
router.post('/', postApiController.addPost);

// path variable이 있으면 구체적인 path부터 우선 처리
// 댓글 조회
router.get('/:no/comments', postApiController.showComments);

// 댓글 등록
router.post('/:no/comments', postApiController.addComment);

// 댓글 수정
router.patch('/:postNo/comments/:commentNo', postApiController.editComment);

// 댓글 삭제
router.delete('/:postNo/comments/:commentNo', postApiController.deleteComment);

// 게시글 데이터 조회
router.get('/:no', postApiController.showPost);

// 게시글 수정
router.put('/:no', postApiController.editPost);

// 게시글 삭제
router.delete('/:no', postApiController.deletePost);

export default router;