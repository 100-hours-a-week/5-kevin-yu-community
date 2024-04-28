import fs from "fs";
import {fileURLToPath} from "url";
import path, {dirname} from "path";

// 날짜 관련 유틸 함수
import timeUtils from '../utils/dataUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/board.json");

let board;

const getBoard = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file).posts;
};

const getPostByNo = async (req) => {
    const postNo = Number(req.params.no);
    board = await getBoard();
    return board.find(post => post.no === postNo);
};

const saveBoard = async (req) => {
    const post = await getPostByNo(req);
    const userInput = req.body;

    post.title = userInput.title;
    post.content = userInput.content;
    post.regDt = timeUtils.getCurrentTime();

    const json = JSON.stringify({posts: board}, null, 2);
    await fs.promises.writeFile(JSON_PATH, json);
};

export default {
    getBoard,
    getPostByNo,
    saveBoard
};