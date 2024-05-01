import {fileURLToPath} from "url";
import path, {dirname} from "path";
import fs from "fs";

import imageUtils from "../utils/ImageUtils.js";

const __filename = fileURLToPath(import.meta.url);
// path.resolve -> __dirname이 route의 하위 경로이므로, route의 상위 디렉토리로 이동해야 public에 접근 가능
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const showPost = (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'post.html'));
};

const showAddForm = (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'add-post.html'));
};

const showEditForm = (req, res) => {
    res.sendFile(path.join(HTML_PATH, 'edit-post.html'));
};

const addPost = async (req, res) => {
    // 사용자가 입력한 값과 이미지 파일의 이름을 결합한 새로운 사용자 객체
    const response = await fetch(`http://localhost:4000/json/posts?id=${req.query.id}`, {
        method: 'POST',
        body: JSON.stringify({
            ...req.body,
            image: req.file === undefined ? "" : req.file.filename
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // 만약 게시글 등록에 실패했다면, 저장한 사진을 삭제
    if (response.status === 500) {
        imageUtils.deleteImage(req.file.filename);
    }

    response.json().then(data => {
        res.status(response.status).json(data);
    });
};

const editPost = async (req, res) => {
    const postNo = Number(req.params.no);
    const userInput = req.body;

    // TODO 사용자 입력 검증 로직 추가
    if (userInput.title.trim() === '' || userInput.content.trim() === '') {
        res.status(400).json({message: '사용자 입력이 올바르지 않습니다.'});
    }

    const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...req.body,
            image: req.file === undefined ? "" : req.file.filename
        })
    });

    const json = await response.json();
    if (response.ok) {
        imageUtils.deleteImage(json.prevImage);
        res.status(200).json(json);
    } else {
        res.status(response.status).json({message: json.message});
    }
};

const deletePost = async (req, res) => {
    const postNo = Number(req.params.no);

    const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
        method: 'DELETE'
    });

    const json = await response.json();
    if (response.ok) {
        imageUtils.deleteImage(json.prevImage);
        res.status(200).json(json);
    } else {
        res.status(response.status).json({message: json.message});
    }
};

export default {
    showPost,
    showAddForm,
    showEditForm,
    addPost,
    editPost,
    deletePost
};