const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is working');
});

app.use('/api', authRoutes);
app.use('/api/students', require('./routes/admin/students'));
app.use('/api/teachers', require('./routes/admin/teachers'));
app.use('/api/departments', require('./routes/admin/departments'));
app.use('/api/classes', require('./routes/admin/classes'));
app.use('/api/subjects', require('./routes/admin/subjects'));
app.use('/api/assignments', require('./routes/admin/assignments'));

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
