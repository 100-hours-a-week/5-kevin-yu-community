const dbConnector = require('./dbConnector');

const getBoard = () => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, u.nickname, u.profile_image
                          FROM posts p
                          INNER JOIN users u ON p.user_id = u.user_id
                          WHERE p.status = 'active'`;

    return dbConnector.executeQuery(query);
};

const getPostByNo = (postId) => {
    const query = `SELECT p.post_id, p.title, p.content, p.post_image, p.created_at, u.nickname, u.profile_image
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

const addPost = (userId, userInput, imageName) => {
    const query = `INSERT INTO posts (user_id, title, content, post_image)
                          VALUES (?, ?, ?, ?)`;

    return dbConnector.executeQueryWithParams(query, [userId, userInput.title, userInput.content, imageName]);
};

const editPost = (postId, userInput) => {
    const query = `UPDATE posts
                          SET title = ?, content = ?, post_image = ?
                          WHERE post_id = ?
                          AND status = 'active'`;
};

const deletePost = (postId) => {
    const query = `UPDATE posts
                          SET status = 'deleted'
                          WHERE post_id = ?`;

    return dbConnector.executeQueryWithParams(query, [postId]);
};

module.exports = {
    getBoard,
    getPostByNo,
    increaseViews,
    addPost,
    editPost,
    deletePost
};