const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'school_secret_key';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Authorization header missing');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).send('Token missing');
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }
    req.user = decoded;
    next();
  });
};

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM student WHERE email = ?', [email], async (err, results) => {
    if (err) {
      return res.status(500).send('Database error');
    }

    if (!results || results.length === 0) {
      return res.status(401).send('User not found');
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).send('Wrong password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        course: user.course,
        year: user.year,
        phone: user.phone,
      },
    });
  });
});

router.get('/student/profile', authenticate, (req, res) => {
  db.query(
    'SELECT id, name, email, course, year, phone, address, dob FROM student WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (!results || results.length === 0) {
        return res.status(404).send('Student not found');
      }
      res.json(results[0]);
    }
  );
});

router.post('/student/profile', authenticate, (req, res) => {
  const { name, phone, course, year, address, dob } = req.body;
  const studentId = req.user.id;

  if (!name || !phone) {
    return res.status(400).send('Name and phone are required');
  }

  db.query(
    'UPDATE student SET name = ?, phone = ?, course = ?, year = ?, address = ?, dob = ? WHERE id = ?',
    [name, phone, course || null, year || null, address || null, dob || null, studentId],
    (err, result) => {
      if (err) {
        console.log('Update error:', err);
        return res.status(500).send('Database error');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('Student not found');
      }
      res.json({
        message: 'Profile updated successfully',
        id: studentId,
        name,
        phone,
        course,
        year,
        address,
        dob,
      });
    }
  );
});

router.get('/student/attendance', authenticate, (req, res) => {
  // Return mock attendance data organized by day and hour
  // In production, fetch from database
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = ["9AM", "10AM", "10:30AM (Break)", "11AM", "12PM", "12:30PM (Lunch)", "1PM", "2PM"];
  
  const attendance = {};
  
  days.forEach((day, dayIdx) => {
    hours.forEach((hour, hourIdx) => {
      const key = `${day}-${hour}`;
      // Skip break and lunch times
      if (hour.includes("Break") || hour.includes("Lunch")) {
        attendance[key] = 'break';
      } else {
        // Mock data: vary attendance randomly
        const random = Math.random();
        attendance[key] = random > 0.3 ? 'present' : 'absent';
      }
    });
  });
  
  res.json(attendance);
});

router.get('/student/marks', authenticate, (req, res) => {
  // Return mock marks data for now
  // In production, fetch from database
  const marksData = {
    subjects: [
      { subject: 'Maths', internal: 20, assignment: 10, exam: 60, extra: 5 },
      { subject: 'Physics', internal: 18, assignment: 9, exam: 55, extra: 4 },
      { subject: 'Chemistry', internal: 17, assignment: 8, exam: 50, extra: 3 },
      { subject: 'English', internal: 19, assignment: 10, exam: 62, extra: 5 },
      { subject: 'Computer Science', internal: 20, assignment: 10, exam: 65, extra: 5 }
    ],
    summary: {
      total: 300,
      percentage: 74.5,
      internalTotal: 94,
      assignmentTotal: 47
    }
  };
  res.json(marksData);
});

router.get('/student/fees', authenticate, (req, res) => {
  // Return mock fee data for now
  // In production, fetch from database
  const feeData = {
    total: 50000,
    paid: 30000,
    pending: 20000,
    dueDate: "2026-05-10",
    status: "Pending"
  };
  res.json(feeData);
});

module.exports = router;