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

const ensureFacultyManagementTables = () => {
  db.query(`CREATE TABLE IF NOT EXISTS faculty_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    faculty_id INT,
    class_name VARCHAR(255),
    course VARCHAR(255),
    subject VARCHAR(255),
    is_tutorship BOOLEAN DEFAULT FALSE,
    student_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.log('Error creating faculty_classes table:', err);
  });

  db.query(`CREATE TABLE IF NOT EXISTS faculty_class_students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    student_name VARCHAR(255),
    roll_no VARCHAR(100),
    marks INT DEFAULT 0,
    result VARCHAR(50),
    details TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`, (err) => {
    if (err) console.log('Error creating faculty_class_students table:', err);
  });
};

ensureFacultyManagementTables();

router.post('/login', (req, res) => {
  const { email, password, role = 'student' } = req.body;
  const table = role === 'faculty' ? 'faculty' : 'student';

  db.query(`SELECT * FROM ${table} WHERE email = ?`, [email], async (err, results) => {
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
      { id: user.id, email: user.email, role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    if (role === 'student') {
      responseUser.course = user.course;
      responseUser.year = user.year;
    } else {
      responseUser.department = user.department;
      responseUser.designation = user.designation;
    }

    res.json({
      token,
      role,
      user: responseUser,
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

router.get('/faculty/profile', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  db.query(
    'SELECT id, name, email, department, designation, phone, address, dob FROM faculty WHERE id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (!results || results.length === 0) {
        return res.status(404).send('Faculty member not found');
      }
      res.json(results[0]);
    }
  );
});

router.post('/faculty/profile', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { name, phone, department, designation, address, dob } = req.body;
  const facultyId = req.user.id;

  if (!name || !phone) {
    return res.status(400).send('Name and phone are required');
  }

  db.query(
    'UPDATE faculty SET name = ?, phone = ?, department = ?, designation = ?, address = ?, dob = ? WHERE id = ?',
    [name, phone, department || null, designation || null, address || null, dob || null, facultyId],
    (err, result) => {
      if (err) {
        console.log('Update error:', err);
        return res.status(500).send('Database error');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('Faculty member not found');
      }
      res.json({
        message: 'Profile updated successfully',
        id: facultyId,
        name,
        phone,
        department,
        designation,
        address,
        dob,
      });
    }
  );
});

router.get('/faculty/schedule', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const schedule = [
    { day: 'Monday', slot: '9AM - 10:30AM', subject: 'Maths', room: 'A1' },
    { day: 'Tuesday', slot: '11AM - 12:30PM', subject: 'Physics', room: 'B2' },
    { day: 'Wednesday', slot: '2PM - 3:30PM', subject: 'Chemistry', room: 'C3' },
    { day: 'Thursday', slot: '9AM - 10:30AM', subject: 'English', room: 'D4' },
    { day: 'Friday', slot: '12PM - 1:30PM', subject: 'Computer Science', room: 'E5' },
  ];

  res.json(schedule);
});

router.get('/faculty/salary', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const salaryInfo = {
    baseSalary: 75000,
    allowances: 15000,
    deductions: 5000,
    netSalary: 85000,
    lastPaid: '2026-04-01',
  };

  res.json(salaryInfo);
});

router.get('/faculty/classes', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  db.query(
    'SELECT * FROM faculty_classes WHERE faculty_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.json(results);
    }
  );
});

router.post('/faculty/classes', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { class_name, course, subject, is_tutorship, student_count } = req.body;

  db.query(
    'INSERT INTO faculty_classes (faculty_id, class_name, course, subject, is_tutorship, student_count) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, class_name, course, subject, is_tutorship ? 1 : 0, student_count || 0],
    (err, result) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.json({ id: result.insertId, class_name, course, subject, is_tutorship, student_count });
    }
  );
});

router.put('/faculty/classes/:id', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const classId = req.params.id;
  const { class_name, course, subject, is_tutorship, student_count } = req.body;

  db.query(
    'UPDATE faculty_classes SET class_name = ?, course = ?, subject = ?, is_tutorship = ?, student_count = ? WHERE id = ? AND faculty_id = ?',
    [class_name, course, subject, is_tutorship ? 1 : 0, student_count || 0, classId, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (result.affectedRows === 0) {
        return res.status(404).send('Class not found');
      }
      res.json({ id: Number(classId), class_name, course, subject, is_tutorship, student_count });
    }
  );
});

router.get('/faculty/classes/:classId/students', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { classId } = req.params;
  db.query(
    'SELECT * FROM faculty_class_students WHERE class_id = ?',
    [classId],
    (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.json(results);
    }
  );
});

router.post('/faculty/classes/:classId/students', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { classId } = req.params;
  const { student_name, roll_no, marks, result, details } = req.body;

  db.query(
    'INSERT INTO faculty_class_students (class_id, student_name, roll_no, marks, result, details) VALUES (?, ?, ?, ?, ?, ?)',
    [classId, student_name, roll_no, marks || 0, result || '', details || ''],
    (err, resultData) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.json({ id: resultData.insertId, class_id: Number(classId), student_name, roll_no, marks: marks || 0, result: result || '', details: details || '' });
    }
  );
});

router.put('/faculty/classes/:classId/students/:studentId', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { classId, studentId } = req.params;
  const { student_name, roll_no, marks, result, details } = req.body;

  db.query(
    'UPDATE faculty_class_students SET student_name = ?, roll_no = ?, marks = ?, result = ?, details = ? WHERE id = ? AND class_id = ?',
    [student_name, roll_no, marks || 0, result || '', details || '', studentId, classId],
    (err, resultData) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (resultData.affectedRows === 0) {
        return res.status(404).send('Student not found');
      }
      res.json({ id: Number(studentId), class_id: Number(classId), student_name, roll_no, marks: marks || 0, result: result || '', details: details || '' });
    }
  );
});

router.put('/faculty/student/:studentId/marks', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const { studentId } = req.params;
  const { marks, result, details } = req.body;

  db.query(
    'UPDATE faculty_class_students SET marks = ?, result = ?, details = ? WHERE id = ?',
    [marks || 0, result || '', details || '', studentId],
    (err, resultData) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (resultData.affectedRows === 0) {
        return res.status(404).send('Student not found');
      }
      res.json({ id: Number(studentId), marks: marks || 0, result: result || '', details: details || '' });
    }
  );
});

module.exports = router;