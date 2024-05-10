require('dotenv').config();

const express = require('express');
const cors = require('cors');

const memberRouter = require('./routes/memberApiRouter.js');
const boardRouter = require('./routes/boardApiRouter.js');
const postRouter = require('./routes/postApiRouter.js');

const server = express();
const port = process.env.PORT;

server.use(express.urlencoded({extended: false}));
server.use(express.json());
server.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));

// member.json을 사용하는 작업들
server.use('/json/members', memberRouter);

// board.json을 사용하는 작업들
server.use('/json/board', boardRouter);
server.use('/json/posts', postRouter);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});