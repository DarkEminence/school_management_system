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

const runAlterIgnoreDup = (sql) => {
  db.query(sql, (err) => {
    if (err && err.code !== 'ER_DUP_FIELDNAME') {
      console.log('Schema alter note:', err.message);
    }
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

/** Optional columns on teacher (match admin `teacher` table) + portal data tables */
const ensureExtendedSchema = () => {
  runAlterIgnoreDup('ALTER TABLE teacher ADD COLUMN designation VARCHAR(255) NULL');
  runAlterIgnoreDup('ALTER TABLE teacher ADD COLUMN address TEXT NULL');
  runAlterIgnoreDup('ALTER TABLE teacher ADD COLUMN dob DATE NULL');

  db.query(`CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS student_fee (
    student_id INT PRIMARY KEY,
    total_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    pending_amount DECIMAL(12,2) DEFAULT 0,
    due_date DATE NULL,
    status VARCHAR(50) DEFAULT 'Pending'
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS student_subject_marks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject_id INT NOT NULL,
    internal_marks INT DEFAULT 0,
    assignment_marks INT DEFAULT 0,
    exam_marks INT DEFAULT 0,
    extra_marks INT DEFAULT 0,
    UNIQUE KEY uq_student_subject (student_id, subject_id)
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS student_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    slot_key VARCHAR(120) NOT NULL,
    status ENUM('present','absent','break') NOT NULL DEFAULT 'absent',
    UNIQUE KEY uq_student_slot (student_id, slot_key)
  )`);

  db.query(`CREATE TABLE IF NOT EXISTS teacher_salary (
    teacher_id INT PRIMARY KEY,
    base_salary DECIMAL(12,2) DEFAULT 0,
    allowances DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    net_salary DECIMAL(12,2) DEFAULT 0,
    last_paid DATE NULL
  )`);
};

ensureFacultyManagementTables();
ensureExtendedSchema();

router.post('/login', (req, res) => {
  const { email, password, role = 'student' } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password required');
  }

  if (role === 'faculty') {
    const sql = `
      SELECT t.teacher_id, t.name, t.email, t.phone, t.password_hash, t.dept_id,
             d.dept_name,
             t.designation
      FROM teacher t
      LEFT JOIN department d ON t.dept_id = d.dept_id
      WHERE t.email = ?
    `;
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.log(err);
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

      const userId = user.teacher_id;
      const token = jwt.sign(
        { id: userId, email: user.email, role: 'faculty' },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        token,
        role: 'faculty',
        user: {
          id: userId,
          name: user.name,
          email: user.email,
          phone: user.phone,
          department: user.dept_name || '',
          designation: user.designation || '',
        },
      });
    });
    return;
  }

  const sql = `
    SELECT s.student_id, s.name, s.email, s.phone, s.password_hash, s.class_id,
           s.gender, s.address, s.dob,
           c.class_name AS class_name
    FROM student s
    LEFT JOIN class c ON s.class_id = c.class_id
    WHERE s.email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);
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

    const userId = user.student_id;
    const token = jwt.sign(
      { id: userId, email: user.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      role: 'student',
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        course: user.class_name || '',
        year: null,
      },
    });
  });
});

router.get('/announcements', (req, res) => {
  db.query(
    'SELECT id, title, description, created_at FROM announcements ORDER BY created_at DESC LIMIT 50',
    (err, results) => {
      if (err) {
        console.log(err);
        return res.json([]);
      }
      res.json(results || []);
    }
  );
});

router.get('/student/profile', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden');
  }

  const sql = `
    SELECT s.student_id AS id, s.name, s.email, s.phone, s.address, s.dob, s.gender, s.class_id,
           c.class_name AS course, NULL AS year
    FROM student s
    LEFT JOIN class c ON s.class_id = c.class_id
    WHERE s.student_id = ?
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }
    if (!results || results.length === 0) {
      return res.status(404).send('Student not found');
    }
    res.json(results[0]);
  });
});

router.post('/student/profile', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden');
  }

  const { name, phone, address, dob, gender } = req.body;
  const studentId = req.user.id;

  if (!name || !phone) {
    return res.status(400).send('Name and phone are required');
  }

  db.query(
    'UPDATE student SET name = ?, phone = ?, address = ?, dob = ?, gender = ? WHERE student_id = ?',
    [name, phone, address || null, dob || null, gender || null, studentId],
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
        address,
        dob,
        gender,
      });
    }
  );
});

router.get('/student/attendance', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden');
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = ['9AM', '10AM', '10:30AM (Break)', '11AM', '12PM', '12:30PM (Lunch)', '1PM', '2PM'];

  db.query(
    'SELECT slot_key, status FROM student_attendance WHERE student_id = ?',
    [req.user.id],
    (err, rows) => {
      const attendance = {};
      const map = {};
      if (!err && rows) {
        rows.forEach((r) => {
          map[r.slot_key] = r.status;
        });
      }

      days.forEach((day) => {
        hours.forEach((hour) => {
          const key = `${day}-${hour}`;
          if (hour.includes('Break') || hour.includes('Lunch')) {
            attendance[key] = 'break';
          } else if (map[key]) {
            attendance[key] = map[key];
          } else {
            attendance[key] = 'absent';
          }
        });
      });

      res.json(attendance);
    }
  );
});

router.get('/student/marks', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden');
  }

  const sql = `
    SELECT sub.subject_name AS subject,
           m.internal_marks AS internal,
           m.assignment_marks AS assignment,
           m.exam_marks AS exam,
           m.extra_marks AS extra
    FROM student_subject_marks m
    JOIN subject sub ON m.subject_id = sub.subject_id
    WHERE m.student_id = ?
    ORDER BY sub.subject_name
  `;

  db.query(sql, [req.user.id], (err, subjects) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

    const list = subjects || [];
    let internalTotal = 0;
    let assignmentTotal = 0;
    let examTotal = 0;
    let extraTotal = 0;

    list.forEach((s) => {
      internalTotal += Number(s.internal) || 0;
      assignmentTotal += Number(s.assignment) || 0;
      examTotal += Number(s.exam) || 0;
      extraTotal += Number(s.extra) || 0;
    });

    const total = internalTotal + assignmentTotal + examTotal + extraTotal;
    const maxPossible = list.length * 100 || 1;
    const percentage = list.length ? Math.round((total / maxPossible) * 1000) / 10 : 0;

    res.json({
      subjects: list,
      summary: {
        total,
        percentage,
        internalTotal,
        assignmentTotal,
        examTotal,
        extraTotal,
      },
    });
  });
});

router.get('/student/fees', authenticate, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).send('Forbidden');
  }

  db.query(
    'SELECT total_amount, paid_amount, pending_amount, due_date, status FROM student_fee WHERE student_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Database error');
      }
      if (!results || results.length === 0) {
        return res.json({
          total: 0,
          paid: 0,
          pending: 0,
          dueDate: null,
          status: 'No record',
        });
      }
      const f = results[0];
      res.json({
        total: Number(f.total_amount) || 0,
        paid: Number(f.paid_amount) || 0,
        pending: Number(f.pending_amount) || 0,
        dueDate: f.due_date,
        status: f.status || 'Pending',
      });
    }
  );
});

router.get('/faculty/profile', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  const sql = `
    SELECT t.teacher_id AS id, t.name, t.email, t.phone,
           d.dept_name AS department,
           COALESCE(t.designation, '') AS designation,
           COALESCE(t.address, '') AS address,
           t.dob
    FROM teacher t
    LEFT JOIN department d ON t.dept_id = d.dept_id
    WHERE t.teacher_id = ?
  `;

  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }
    if (!results || results.length === 0) {
      return res.status(404).send('Faculty member not found');
    }
    res.json(results[0]);
  });
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

  const sql = `
    UPDATE teacher t
    LEFT JOIN department d ON d.dept_name = ?
    SET t.name = ?, t.phone = ?, t.dept_id = COALESCE(d.dept_id, t.dept_id),
        t.designation = ?, t.address = ?, t.dob = ?
    WHERE t.teacher_id = ?
  `;

  db.query(
    sql,
    [department || '', name, phone, designation || null, address || null, dob || null, facultyId],
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

  const sql = `
    SELECT c.class_name, sub.subject_name AS subject_name
    FROM class_subject_teacher cst
    JOIN class c ON cst.class_id = c.class_id
    JOIN subject sub ON cst.subject_id = sub.subject_id
    WHERE cst.teacher_id = ?
    ORDER BY c.class_name, sub.subject_name
  `;

  db.query(sql, [req.user.id], (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const schedule = (rows || []).map((r, i) => ({
      day: weekdays[i % weekdays.length],
      slot: `Class: ${r.class_name}`,
      subject: r.subject_name,
      room: r.class_name,
    }));

    res.json(schedule);
  });
});

router.get('/faculty/salary', authenticate, (req, res) => {
  if (req.user.role !== 'faculty') {
    return res.status(403).send('Forbidden');
  }

  db.query(
    'SELECT base_salary, allowances, deductions, net_salary, last_paid FROM teacher_salary WHERE teacher_id = ?',
    [req.user.id],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send('Database error');
      }
      if (!results || results.length === 0) {
        return res.json({
          baseSalary: 0,
          allowances: 0,
          deductions: 0,
          netSalary: 0,
          lastPaid: null,
        });
      }
      const s = results[0];
      res.json({
        baseSalary: Number(s.base_salary) || 0,
        allowances: Number(s.allowances) || 0,
        deductions: Number(s.deductions) || 0,
        netSalary: Number(s.net_salary) || 0,
        lastPaid: s.last_paid,
      });
    }
  );
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
