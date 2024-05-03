import {fileURLToPath} from "url";
import path, {dirname} from "path";
import imageUtils from "../utils/ImageUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const HTML_PATH = path.join(__dirname, 'public/html');

const methods = {
    showPost: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'post.html'));
    },
    showAddForm: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'add-post.html'));
    },
    showEditForm: (req, res) => {
        res.sendFile(path.join(HTML_PATH, 'edit-post.html'));
    },
    addPost: async (req, res) => {
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
        if (response.status === 500) {
            imageUtils.deleteImage('posts', req.file.filename);
        }
        response.json().then(data => {
            res.status(response.status).json(data);
        });
    },
    editPost: async (req, res) => {
        const postNo = Number(req.params.no);
        const userInput = req.body;
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
            imageUtils.deleteImage('posts', json.prevImage);
            res.status(200).json(json);
        } else {
            res.status(response.status).json({message: json.message});
        }
    },
    deletePost: async (req, res) => {
        const postNo = Number(req.params.no);
        const response = await fetch(`http://localhost:4000/json/posts/${postNo}`, {
            method: 'DELETE'
        });
        const json = await response.json();
        if (response.ok) {
            imageUtils.deleteImage('posts', json.prevImage);
            res.status(200).json(json);
        } else {
            res.status(response.status).json({message: json.message});
        }
    }
}

export default methods;