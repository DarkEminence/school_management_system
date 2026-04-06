-- Create Database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

CREATE TABLE department (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    hod_id INT NULL
);

CREATE TABLE teacher (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

ALTER TABLE department
ADD CONSTRAINT fk_department_hod
FOREIGN KEY (hod_id) REFERENCES teacher(teacher_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

CREATE TABLE class (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES department(dept_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE student (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    class_id INT,
    FOREIGN KEY (class_id) REFERENCES class(class_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE subject (
    subject_id INT AUTO_INCREMENT PRIMARY KEY,
    subject_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE class_subject_teacher (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    subject_id INT,
    teacher_id INT,
    UNIQUE (class_id, subject_id, teacher_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE exam (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    exam_name VARCHAR(100) NOT NULL,
    exam_date DATE NOT NULL,
    subject_id INT,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE result (
    result_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    exam_id INT,
    marks DECIMAL(5,2),
    grade VARCHAR(5),
    UNIQUE (student_id, exam_id),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES exam(exam_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    subject_id INT,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave') NOT NULL,
    UNIQUE (student_id, subject_id, date),
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subject(subject_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE tutorship (
    tutorship_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    teacher_id INT,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (class_id) REFERENCES class(class_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teacher(teacher_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE fee (
    fee_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE,
    payment_date DATE,
    status ENUM('Paid', 'Pending', 'Overdue') DEFAULT 'Pending',
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender_id INT,
    FOREIGN KEY (sender_id) REFERENCES teacher(teacher_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE notification_recipient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    notification_id INT,
    student_id INT,
    UNIQUE (notification_id, student_id),
    FOREIGN KEY (notification_id) REFERENCES notification(notification_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (student_id) REFERENCES student(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
