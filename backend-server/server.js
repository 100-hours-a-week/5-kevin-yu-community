require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const memberRouter = require('./routes/memberApiRouter.js');
const boardRouter = require('./routes/boardApiRouter.js');
const postRouter = require('./routes/postApiRouter.js');

const server = express();
const port = process.env.PORT;

server.use(express.urlencoded({extended: false}));
server.use(express.json());

server.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

server.use(session({
        secret: process.env.SESSION_SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60 * 24, // 쿠키 유효기간 1일
        }
    })
);

// member.json을 사용하는 작업들
server.use('/json/members', memberRouter);

// board.json을 사용하는 작업들
server.use('/json/board', boardRouter);
server.use('/json/posts', postRouter);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});