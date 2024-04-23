const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(__dirname));
// app.use(express.urlencoded({extended: false}));
// app.use(express.json());

// route와 연결될 html 정의
const routes = [
    { path: "/login", file: "login.html" }, // 로그인
    { path: "/join", file: "join.html" }, // 회원가입
    { path: "/board", file: "board.html" }, // 게시글 목록 조회
    { path: "/post", file: "post.html" }, // 게시글 상세 조회
    { path: "/post/add-form", file: "add-post.html" }, // 게시글 등록
    { path: "/post/edit-form", file: "edit-post.html" }, // 게시글 수정
    { path: "/member", file: "edit-member.html" }, // 회원 정보 수정
    { path: "/password", file: "edit-password.html" } // 게시글 수정
];

// 각 route별로 콜백 함수 등록
const HTML_PATH = path.join(__dirname, "html");
routes.forEach(route => {
    app.get(route.path, (req, res) => {
        res.sendFile(path.join(HTML_PATH, route.file));
    });
});

// JSON 게시판 정보 요청 API
const JSON_PATH = path.join(__dirname, "json");
app.get('/json/board', (req, res) => {
    res.sendFile(path.join(JSON_PATH, 'board.json'));
});

// JSON 회원 정보 요청 API
app.get('/json/member', (req, res) => {
    res.sendFile(path.join(JSON_PATH, 'member.json'));
});


// function dateToString(date) {
//     return date.toString().padStart(2, '0');
// }
//
// function getCurrentTime() {
//     const date = new Date();
//     let year = date.getFullYear();
//     let month = dateToString(date.getMonth() + 1);
//     let day = dateToString(date.getDate());
//     let hours = dateToString(date.getHours());
//     let minutes = dateToString(date.getMinutes());
//     let seconds = dateToString(date.getSeconds());
//
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }
//
// function createPost(req) {
//     const newPost = req.body;
//     newPost.writer = '익명의 작성자';
//     newPost.regDt = getCurrentTime();
//     newPost.like = 0;
//     newPost.comment = 0;
//     newPost.hit = 0;
//     newPost.comments = [];
//
//     return newPost;
// }
//
// app.post('/json/board', (req, res) => {
//     const newPost = createPost(req);
//     console.log(newPost);
// });

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
