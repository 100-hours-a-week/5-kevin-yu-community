const dbConnector = require('./dbConnector');

const getUserByLoginInfo = (userInput) => {
    const query = `SELECT user_id, nickname, profile_image
                          FROM users
                          WHERE email = ? AND password = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userInput.email, userInput.password]);
};

const getUserById = (userId) => {
    const query = `SELECT nickname, profile_image
                          FROM users
                          WHERE user_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userId]);
};

const addUser = (userInput) => {
    const query = `INSERT INTO users (email, password, nickname, profile_image) 
                          VALUES (?, ?, ?, ?)`;

    let params = [userInput.email, userInput.password, userInput.nickname, userInput.image];
    return dbConnector.executeQueryWithParams(query, params);
};

const editUser = (userId, userInput) => {
    const query = `UPDATE users
                          SET nickname = ?, profile_image = ?
                          WHERE user_id = ?
                          AND status = 'active'`;

    return dbConnector.executeQueryWithParams(query, [userInput.nickname, userInput.image, userId]);
};

const deleteUser = (userId) => {
    const query = `UPDATE users
                          SET status = 'deleted'
                          WHERE user_id = ?`;

    return dbConnector.executeQueryWithParams(query, [userId]);
};

module.exports = {
    getUserByLoginInfo,
    getUserById,
    addUser,
    editUser,
    deleteUser,
};