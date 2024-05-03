import express from 'express';

import postController from '../controllers/postController.js';
import imageUtils from "../utils/ImageUtils.js";

const router = express.Router();
const {uploadPosts} = imageUtils;

// 게시글 등록 폼 조회
router.get('/add-form', postController.showAddForm);

// 게시글 등록
router.post('/', uploadPosts.single('file'), postController.addPost);

// 게시글 조회
router.get('/:no', postController.showPost);

// 게시글 수정 폼 조회
router.get('/:no/edit-form', postController.showEditForm);

// 게시글 수정
router.put('/:no', uploadPosts.single('file'), postController.editPost);

// 게시글 삭제
router.delete('/:no', postController.deletePost);

export default router;