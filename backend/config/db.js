const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'school_management'
});

db.connect(err => {
    if (err) {
        console.log('DB Error:', err);
        return;
    }
    console.log('MySQL Connected')
})

module.exports = db;