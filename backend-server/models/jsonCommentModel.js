const fs = require("fs");
const path = require("path");

// 날짜 관련 유틸 함수
const timeUtils = require('../utils/dataUtils.js');

const JSON_PATH = path.join(__dirname, "..", "json/comment.json");

const getCommentJson = async () => {
    const file = await fs.promises.readFile(JSON_PATH, 'utf8');
    return JSON.parse(file);
};

let json; // findCommentsByPostNo에서 찾은 json을 다른 함수에서도 사용하기 위해
const findCommentsByPostNo = async (postNo) => {
    json = await getCommentJson();
    return json[postNo];
};

// 새로운 게시글이 등록되면 새로운 댓글 객체를 만들어서 JSON에 추가
const makeCommentObject = async (postNo) => {
    const json = await getCommentJson();
    json[postNo] = {
        sequence: 1,
        comments: []
    };
    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

// 게시글이 삭제되면 연결되어 있는 댓글 객체도 함께 제거
const deleteCommentObject = async (postNo) => {
    const json = await getCommentJson();
    delete json[postNo];
    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
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
    return findComments.comments.length;
};

const editComment = async (postNo, commentNo, newContent) => {
    const findComments = await findCommentsByPostNo(postNo);
    const comment = findComments.comments.find(comment => comment.no === commentNo);
    if (comment) {
        comment.content = newContent;
    } else {
        throw new Error('댓글 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
}

const deleteComment = async (postNo, commentNo) => {
    const findComments = await findCommentsByPostNo(postNo);
    const index = findComments.comments.findIndex(comment => comment.no === commentNo);
    if (index !== -1) {
        findComments.comments.splice(index, 1);
    } else {
        throw new Error('댓글 정보를 찾을 수 없습니다.');
    }

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
    return findComments.comments.length;
}

const changeNickname = async (prevNickname, newNickname) => {
    const json = await getCommentJson();
    // Object.keys -> 객체의 모든 속성을 배열로 반환(keySet)
    Object.keys(json).forEach(postNo => {
        json[postNo].comments.forEach(comment => {
            if (comment.writer === prevNickname) {
                comment.writer = newNickname;
            }
        });
    });

    await fs.promises.writeFile(JSON_PATH, JSON.stringify(json, null, 2));
};

module.exports = {
    findCommentsByPostNo,
    makeCommentObject,
    deleteCommentObject,
    saveComment,
    editComment,
    deleteComment,
    changeNickname,
};