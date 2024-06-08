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

module.exports = {
    executeQuery,
    executeQueryWithParams
};