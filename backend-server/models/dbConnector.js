const db = require('./dbConfig');

const executeQuery = (query) => {
    return new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

const executeQueryWithParams = (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, result) => {
            if (err) {
                console.error(err);
                return reject(err);
            }
            resolve(result);
        });
    });
};

const beginTransaction = () => {
    return new Promise((resolve, reject) => {
        db.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

const commitTransaction = () => {
    return new Promise((resolve, reject) => {
        db.commit((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

const rollbackTransaction = () => {
    return new Promise((resolve, reject) => {
        db.rollback((err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
};

module.exports = {
    executeQuery,
    executeQueryWithParams,
    beginTransaction,
    commitTransaction,
    rollbackTransaction,
};
