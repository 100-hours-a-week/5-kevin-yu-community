import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

const app = express();
const port = 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// JSON 게시판 정보 요청 API
const JSON_PATH = path.join(__dirname, "json");
app.get('/json/board', (req, res) => {
    res.sendFile(path.join(JSON_PATH, 'board.json'));
});

// JSON 회원 정보 요청 API
app.get('/json/member', (req, res) => {
    res.sendFile(path.join(JSON_PATH, 'member.json'));
});

function dateToString(date) {
    return date.toString().padStart(2, '0');
}

function getCurrentTime() {
    const date = new Date();
    let year = date.getFullYear();
    let month = dateToString(date.getMonth() + 1);
    let day = dateToString(date.getDate());
    let hours = dateToString(date.getHours());
    let minutes = dateToString(date.getMinutes());
    let seconds = dateToString(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function createPost(req) {
    const newPost = req.body;
    newPost.writer = '익명의 작성자';
    newPost.regDt = getCurrentTime();
    newPost.like = 0;
    newPost.comment = 0;
    newPost.hit = 0;
    newPost.comments = [];

    return newPost;
}

app.post('/json/board', (req, res) => {
    const newPost = createPost(req);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
