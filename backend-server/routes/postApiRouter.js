const express = require('express');

const postApiController = require("../controllers/postApiController.js");
const checkLogin = require('../middlewares/checkLogin.js');
const uploadTemporary = require('../utils/ImageUtils.js');

const router = express.Router();

// path variable이 있으면 구체적인 path부터 우선 처리
// 댓글 조회
router.get('/:no/comments', postApiController.showComments);

// 댓글 등록
router.post('/:no/comments', checkLogin.isLoggedIn, postApiController.addComment);

// 댓글 수정
router.patch('/:postNo/comments/:commentNo', postApiController.editComment);

// 댓글 삭제
router.delete('/:postNo/comments/:commentNo', postApiController.deleteComment);

// 게시글 등록
router.post('/', checkLogin.isLoggedIn, uploadTemporary.single('file'), postApiController.addPost);

// 게시글 데이터 조회
router.get('/:no', checkLogin.isLoggedIn, postApiController.showPost);

// 게시글 수정
router.put('/:no', postApiController.editPost);

// 게시글 삭제
router.delete('/:no', postApiController.deletePost);

module.exports = router;