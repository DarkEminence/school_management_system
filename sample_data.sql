USE school_management;

-- ========================
-- SAMPLE DEPARTMENTS
-- ========================
INSERT INTO department (dept_name) VALUES
('Computer Science'),
('Electronics'),
('Mechanical');

-- ========================
-- SAMPLE TEACHERS
-- ========================
INSERT INTO teacher (name, phone, email, password_hash, dept_id) VALUES
('Dr. Alan', '9876543210', 'alan@school.com', 'hashed_password', 1),
('Prof. Smith', '9123456780', 'smith@school.com', 'hashed_password', 2),
('Dr. John', '9988776655', 'john@school.com', 'hashed_password', 3);

-- Assign HODs
UPDATE department SET hod_id = 1 WHERE dept_id = 1;
UPDATE department SET hod_id = 2 WHERE dept_id = 2;
UPDATE department SET hod_id = 3 WHERE dept_id = 3;

-- ========================
-- CLASSES
-- ========================
INSERT INTO class (class_name, dept_id) VALUES
('CSE-A', 1),
('ECE-A', 2);

-- ========================
-- STUDENTS
-- ========================
INSERT INTO student (name, dob, gender, address, phone, email, password_hash, class_id) VALUES
('Rahul', '2005-05-10', 'Male', 'Kerala', '9000000001', 'rahul@student.com', 'hashed_password', 1),
('Aisha', '2005-07-15', 'Female', 'Kerala', '9000000002', 'aisha@student.com', 'hashed_password', 1);

-- ========================
-- SUBJECTS
-- ========================
INSERT INTO subject (subject_name) VALUES
('DBMS'),
('OS'),
('Maths');

-- ========================
-- CLASS_SUBJECT_TEACHER
-- ========================
INSERT INTO class_subject_teacher (class_id, subject_id, teacher_id) VALUES
(1, 1, 1),
(1, 2, 1),
(2, 3, 2);

-- ========================
-- EXAMS
-- ========================
INSERT INTO exam (exam_name, exam_date, subject_id) VALUES
('Mid Term DBMS', '2026-03-01', 1),
('Mid Term OS', '2026-03-02', 2);

-- ========================
-- RESULTS
-- ========================
INSERT INTO result (student_id, exam_id, marks, grade) VALUES
(1, 1, 85, 'A'),
(2, 1, 78, 'B');

-- ========================
-- ATTENDANCE
-- ========================
INSERT INTO attendance (student_id, subject_id, date, status) VALUES
(1, 1, '2026-03-10', 'Present'),
(2, 1, '2026-03-10', 'Absent');

-- ========================
-- FEES
-- ========================
INSERT INTO fee (student_id, amount, due_date, payment_date, status) VALUES
(1, 5000, '2026-04-01', NULL, 'Pending'),
(2, 5000, '2026-04-01', '2026-03-20', 'Paid');

-- ========================
-- NOTIFICATIONS
-- ========================
INSERT INTO notification (title, message, sender_id) VALUES
('Exam Notice', 'Mid term exams start next week', 1);

INSERT INTO notification_recipient (notification_id, student_id) VALUES
(1, 1),
(1, 2);
