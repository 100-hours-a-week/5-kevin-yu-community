import express from 'express';
import memberController from "../controllers/memberController.js";

const router = express.Router();

// 사용자가 login을 시도할 때, 알맞은 계정 정보인지 확인
router.post('/login', memberController.loginCheck);

export default router;