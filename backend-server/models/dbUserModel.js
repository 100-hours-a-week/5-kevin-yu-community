const dbConnector = require('./dbConnector');

const getUserByLoginInfo = (userInput) => {
    const query = `SELECT user_id, email, password, nickname, profile_image
                          FROM users
                          WHERE email = ? AND password = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userInput.email, userInput.password]);
};

const getUserById = (userId) => {
    const query = `SELECT user_id, email, password, nickname, profile_image
                          FROM users
                          WHERE user_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userId]);
};

const getAllUsers = () => {
    const query = `SELECT user_id, email, password, nickname, profile_image
                          FROM users
                          WHERE status = 'active'`;

    return dbConnector.executeQuery(query);
};

const addUser = (userInput) => {
    const query = `INSERT INTO users (email, password, nickname, profile_image) 
                          VALUES (?, ?, ?, ?)`;

    let params = [userInput.email, userInput.password, userInput.nickname, userInput.image];
    return dbConnector.executeQueryWithParams(query, params);
};

const editUser = (userId, nickname, imageName) => {
    const query = `UPDATE users
                          SET nickname = ?, profile_image = ?
                          WHERE user_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [nickname, imageName, userId]);
};

const editPassword = (userId, password) => {
    const query = `UPDATE users
                          SET password = ?
                          WHERE user_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [password, userId]);
};

const deleteUser = (userId) => {
    const query = `UPDATE users
                          SET status = 'deleted'
                          WHERE user_id = ?`;

    return dbConnector.executeQueryWithParams(query, [userId]);
};

const updateTime = (column, userId) => {
    const query = `UPDATE users
                          SET ${column} = NOW()
                          WHERE user_id = ?`;

    return dbConnector.executeQueryWithParams(query, [userId]);
};

module.exports = {
    getUserByLoginInfo,
    getUserById,
    getAllUsers,
    addUser,
    editUser,
    editPassword,
    deleteUser,
    updateTime,
};