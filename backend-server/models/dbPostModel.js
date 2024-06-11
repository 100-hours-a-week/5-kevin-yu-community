const dbConnector = require('./dbConnector');

const getBoard = () => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, p.views, p.comment_count, u.nickname, u.profile_image
                          FROM posts p
                          INNER JOIN users u ON p.user_id = u.user_id
                          WHERE p.status = 'active'
                          ORDER BY p.created_at DESC`;

    return dbConnector.executeQuery(query);
};

const getPostById = (postId) => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, p.views, p.comment_count, u.nickname, u.profile_image
                          FROM posts p
                          INNER JOIN users u ON p.user_id = u.user_id
                          WHERE p.post_id = ?
                          AND p.status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

const increaseViews = (postId) => {
    const query = `UPDATE posts
                          SET views = views + 1
                          WHERE post_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

const increaseCommentCount = (postId) => {
    const query = `UPDATE posts
                          SET comment_count = comment_count + 1
                          WHERE post_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};
const decreaseCommentCount = (postId) => {
    const query = `UPDATE posts
                          SET comment_count = comment_count - 1
                          WHERE post_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

const addPost = (userId, userInput, imageName) => {
    const query = `INSERT INTO posts (user_id, title, content, post_image)
                          VALUES (?, ?, ?, ?)`;

    return dbConnector.executeQueryWithParams(query, [userId, userInput.title, userInput.content, imageName]);
};

const editPost = (postId, userInput, imageName) => {
    const query = `UPDATE posts
                          SET title = ?, content = ?, post_image = ?
                          WHERE post_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userInput.title, userInput.content, imageName, postId]);
};

const deletePost = (postId) => {
    const query = `UPDATE posts
                          SET status = 'deleted'
                          WHERE post_id = ?`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

module.exports = {
    getBoard,
    getPostById,
    increaseViews,
    increaseCommentCount,
    decreaseCommentCount,
    addPost,
    editPost,
    deletePost
};