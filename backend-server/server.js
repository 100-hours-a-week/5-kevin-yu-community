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
    methods: ['GET', 'POST', 'PATCH']
}));

// member.json을 사용하는 작업들
server.use('/json/members', memberRouter);

// board.json을 사용하는 작업들
server.use('/json/board', boardRouter);
server.use('/json/posts', postRouter);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});