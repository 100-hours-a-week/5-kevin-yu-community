import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import multer from 'multer'; // multipart/form-data 처리용 body-parser

import memberController from '../controllers/memberController.js';

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images/members'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const upload = multer({storage: storage});
const router = express.Router();

// 로그인 페이지 서빙
router.get('/login', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'login.html'));
});
// 사용자가 로그인 시도
router.post('/login', memberController.loginCheck);

// 회원가입 페이지 서빙
router.get('/join', (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'join.html'));
});
// 사용자가 회원가입 시도
router.post('/join', upload.single('file'), memberController.join);
// 사용자 정보 수정 페이지 서빙
router.get('/info', memberController.showEditInfoForm);
// 사용자 정보 수정
router.put('/', upload.single('file'), memberController.editMemberInfo);
// 사용자 정보 삭제
router.delete('/', memberController.deleteMember);
router.get('/password', memberController.showPasswordForm);

export default router;