const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/auth');

const app =  express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Server is working');
});

app.use('/api', authRoutes);

app.listen(5000, () => {
    console.log('Server running on port 5000');
})