import express from 'express';
import cors from 'cors';

import memberRouter from './routes/memberApiRouter.js';
import boardRouter from './routes/boardApiRouter.js';
import postRouter from './routes/postApiRouter.js';

const server = express();
const port = 4000;

server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

// member.json을 사용하는 작업들
server.use('/json/member', memberRouter);

// board.json을 사용하는 작업들
server.use('/json/board', boardRouter);
server.use('/json/posts', postRouter);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// server.get('/json/board', (req, res) => {
//     res.sendFile(path.join(JSON_PATH, 'board.json'));
// });
//
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
// server.post('/json/board', (req, res) => {
//     const newPost = createPost(req);
// });
