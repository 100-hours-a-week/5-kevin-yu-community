import express from 'express';

import memberController from "../controllers/memberApiController.js";

const router = express.Router();

// 사용자가 login을 시도할 때, 알맞은 계정 정보인지 확인
router.post('/login', memberController.loginCheck);

// 회원가입 정보를 검증하고 가입 결과를 반환
router.post('/join', memberController.join);

export default router;