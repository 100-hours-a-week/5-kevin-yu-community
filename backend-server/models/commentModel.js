import fs from "fs";
import {fileURLToPath} from "url";
import path, {dirname} from "path";

// 날짜 관련 유틸 함수
import timeUtils from '../utils/dataUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(dirname(__filename), '..');
const JSON_PATH = path.join(__dirname, "json/comment.json");

const getCommentJson = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file);
};

let json; // findCommentsByPostNo에서 찾은 json을 다른 함수에서도 사용하기 위해
const findCommentsByPostNo = async (postNo) => {
    json = await getCommentJson();
    return json[postNo];
};

const saveComment = async (postNo, member, content) => {
    const findComments = await findCommentsByPostNo(postNo);
    const newComment = {
        no: findComments.sequence,
        content: content,
        writer: member.nickname,
        regDt: timeUtils.getCurrentTime()
    };

    findComments.sequence++;
    findComments.comments.push(newComment);

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

export default {
    findCommentsByPostNo,
    saveComment
};