import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import multer from 'multer'; // multipart/form-data 처리용 body-parser

import postController from '../controllers/postController.js';

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'public/images/posts'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname);
    }
});

const router = express.Router();
const upload = multer({storage: storage});

// 게시글 등록 폼 조회
router.get('/add-form', postController.showAddForm);

// 게시글 등록
router.post('/', upload.single('file'), postController.addPost);

// 게시글 조회
router.get('/:no', postController.showPost);

// 게시글 수정 폼 조회
router.get('/:no/edit-form', postController.showEditForm);

// 게시글 수정
router.put('/:no', upload.single('file'), postController.editPost);

// 게시글 삭제
router.delete('/:no', postController.deletePost);

export default router;