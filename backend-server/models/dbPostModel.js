const dbConnector = require('./dbConnector');
const timeUtils = require('../utils/dataUtils.js');

const getBoard = async () => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, u.nickname, u.profile_image
                          FROM posts p
                          INNER JOIN users u ON p.user_id = u.user_id`;

    return await dbConnector.executeQuery(query);
};

const getPostByNo = (postNo) => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, u.nickname, u.profile_image
                          FROM posts p
                          INNER JOIN users u ON p.user_id = u.user_id
                          WHERE p.post_id = ?`;

    return dbConnector.executeQueryWithParams([postNo]);
};

module.exports = {
    getBoard,
    getPostByNo
}