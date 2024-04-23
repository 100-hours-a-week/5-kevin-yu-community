const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

const HTML_PATH = path.join(__dirname, "html");
app.use(express.static(__dirname));

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
routes.forEach(route => {
    app.get(route.path, (request, response) => {
        response.sendFile(path.join(HTML_PATH, route.file));
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
