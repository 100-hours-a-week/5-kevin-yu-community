require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

db.connect((err) => {
    if (err) {
        console.error('MySQL 연결 실패');
        return;
    }
    console.log('MySQL 연결 완료');
});

module.exports = db;