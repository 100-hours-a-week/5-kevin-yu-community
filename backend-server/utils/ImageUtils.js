const path = require('path');
const multer = require('multer');

// 이미지 파일만 받을 수 있도록 filter 구성
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    }

    cb("Error: File upload only supports the following filetypes - " + filetypes);
}

// 이미지 임시 저장소 (메모리)
const uploadTemporary = multer({storage: multer.memoryStorage(), fileFilter});

module.exports = uploadTemporary;