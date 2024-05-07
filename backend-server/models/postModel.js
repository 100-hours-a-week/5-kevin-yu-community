import fs from "fs";
import {fileURLToPath} from "url";
import path, {dirname} from "path";

// 날짜 관련 유틸 함수
import timeUtils from '../utils/dataUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const BOARD_JSON = path.join(__dirname, 'json/board.json');

const getBoardJson = async () => {
    const file = await fs.promises.readFile(BOARD_JSON, 'utf8');
    return JSON.parse(file);
};

const getBoard = async () => {
    return getBoardJson()
        .then(json => json.posts);
};

const getSequence = async () => {
    return getBoardJson()
        .then(json => json.sequence);
};

let board; // getPostByNo에서 찾은 board를 다른 함수에서도 사용하기 위해
const getPostByNo = async (postNo) => {
    board = await getBoard();
    return board.find(post => post.no === postNo);
};

const addPost = async (userInput, nickname) => {
    const board = await getBoard();
    const sequence = await getSequence();

    const newPost = {
        no: sequence,
        title: userInput.title,
        content: userInput.content,
        image: userInput.image,
        writer: nickname,
        regDt: timeUtils.getCurrentTime(),
        like: 0,
        comment: 0,
        hit: 0,
        comments: []
    };
    board.unshift(newPost);

    await fs.promises.writeFile(BOARD_JSON, JSON.stringify({sequence: sequence + 1, posts: board}, null, 2));
    return sequence;
};

const editPost = async (postNo, userInput) => {
    const post = await getPostByNo(postNo);

    const prevImage = post.image;

    post.title = userInput.title;
    post.content = userInput.content;
    post.image = userInput.image;
    post.regDt = timeUtils.getCurrentTime();

    const json = JSON.stringify({sequence: await getSequence(), posts: board}, null, 2);
    await fs.promises.writeFile(BOARD_JSON, json);

    return prevImage; // 이전 이미지를 삭제하기 위해 이미지명 반환
};

const deletePost = async (postNo) => {
    const board = await getBoard();

    const index = board.findIndex(post => post.no === postNo);
    const prevImage = board[index].image;
    if (index !== -1) {
        board.splice(index, 1);
    } else {
        throw new Error('게시글 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(BOARD_JSON, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
    return prevImage;
};

const changeNickname = async (prevNickname, newNickname) => {
    const board = await getBoard();
    board.forEach(post => {
        if (post.writer === prevNickname) {
            post.writer = newNickname;
        }
    });

    await fs.promises.writeFile(BOARD_JSON, JSON.stringify({sequence: await getSequence(), posts: board}, null, 2));
};

export default {
    getBoard,
    getPostByNo,
    addPost,
    editPost,
    deletePost,
    changeNickname,
};