const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');

router.post('/login', (req,res) => {
    const { email, password } = req.body;

    db.query(
        'SELECT * FROM student WHERE email  = ?',[email],
        async (err, results) => {
             if (results.length === 0) {
                return res.status(401).send('User not found');
             }
             const user = results[0];
             const match = await bcrypt.compare(password,user.password_hash);
             if (!match){
                return res.status(401).send('Wrong password');
             }
             res.send('Login successful')
        }
    );
});

module.exports = router;