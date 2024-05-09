const express = require('express');

const memberController = require("../controllers/memberApiController.js");

const router = express.Router();

// 아이디로 사용자 정보를 찾아서 반환
router.get('/', memberController.findMemberById);
// 사용자가 login을 시도할 때, 알맞은 계정 정보인지 확인
router.post('/login', memberController.loginCheck);
// 회원가입 정보를 검증하고 가입 결과를 반환
router.post('/join', memberController.join);
// 회원정보 중복체크
router.get('/duplication', memberController.checkDuplication);
// 회원정보 수정
router.put('/', memberController.editMember);
// 회원정보 삭제
router.delete('/', memberController.deleteMember);
// 비밀번호 변경
router.patch('/password', memberController.editPassword);
// 회원들의 프로필 이미지 조회
router.get('/images', memberController.getProfileImages);

module.exports = router;