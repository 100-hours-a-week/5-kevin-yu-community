const dbConnector = require('./dbConnector');

const getCommentsById = (postId) => {
    const query = `SELECT c.comment_id, c.content, c.created_at, u.nickname, u.profile_image
                          FROM comments c
                          INNER JOIN users u ON c.user_id = u.user_id
                          WHERE c.post_id = ?
                          AND c.status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

const addComment = (postId, userId, content) => {
    const query = `INSERT INTO comments (post_id, user_id, content)
                          VALUES (?, ?, ?)`;

    return dbConnector.executeQueryWithParams(query, [postId, userId, content]);
};

const editComment = (commentId, content) => {
    const query = `UPDATE comments
                          SET content = ?
                          WHERE comment_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [content, commentId]);
};

const deleteComment = (commentId) => {
    const query = `UPDATE comments
                          SET status = 'deleted'
                          WHERE comment_id = ?`;

    return dbConnector.executeQueryWithParams(query, [commentId]);
};

module.exports = {
    getCommentsById,
    addComment,
    editComment,
    deleteComment,
};