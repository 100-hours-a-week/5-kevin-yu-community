import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import memberController from '../controllers/memberController.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, "public/html");

// 로그인 페이지 보여줌
router.get('/login', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'login.html'));
});

// 사용자가 로그인 시도
router.post('/login', memberController.loginCheck);

export default router;