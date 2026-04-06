📘 AIM OF THE PROJECT

The aim of this project is to develop a School Management System using Node.js, React, and MySQL to manage students, teachers, departments, classes, subjects, and assignments in a simple and organized way.

⸻

📦 MODULES IN THE PROJECT

There are 7 modules:

1. Student Module
	•	Add student
	•	View students
	•	Update student
	•	Delete student

⸻

2. Teacher Module
	•	Add teacher
	•	View teachers
	•	Update teacher
	•	Delete teacher

⸻

3. Department Module
	•	Add department
	•	View departments
	•	Update department
	•	Delete department

⸻

4. Class Module
	•	Add class
	•	View classes
	•	Update class
	•	Delete class

⸻

5. Subject Module
	•	Add subject
	•	View subjects
	•	Update subject
	•	Delete subject

⸻

6. Assignment Module
	•	Assign teacher to subject in class
	•	View assignments
	•	Delete assignment

⸻

7. Authentication Module
	•	User login (student/faculty)
	•	JWT token authentication

⸻

🔢 TOTAL MODULES

👉 7 Modules

⸻

🗄️ TABLES USED (7 TABLES)

1. student
	•	student_id (Primary Key)
	•	name
	•	dob
	•	gender
	•	address
	•	phone
	•	email
	•	password_hash
	•	class_id (Foreign Key)

2. teacher
	•	teacher_id (Primary Key)
	•	name
	•	phone
	•	email
	•	password_hash
	•	dept_id (Foreign Key)
	•	designation

3. department
	•	dept_id (Primary Key)
	•	dept_name
	•	hod_id (Foreign Key to teacher_id)

4. class
	•	class_id (Primary Key)
	•	class_name
	•	dept_id (Foreign Key)

5. subject
	•	subject_id (Primary Key)
	•	subject_name

6. class_subject_teacher
	•	id (Primary Key)
	•	teacher_id (Foreign Key)
	•	subject_id (Foreign Key)
	•	class_id (Foreign Key)

7. faculty_classes
	•	id (Primary Key)
	•	faculty_id
	•	class_name
	•	course
	•	subject
	•	is_tutorship
	•	student_count
	•	created_at

⸻

🔗 RELATIONSHIP & FOREIGN KEY
	•	Department → Teacher
👉 One department can have many teachers
👉 dept_id is foreign key in teacher
👉 Department cannot be deleted if teachers exist

⸻

	•	Department → Class
👉 One department can have many classes
👉 dept_id is foreign key in class
👉 Class cannot be added without valid dept_id

⸻

	•	Class → Student
👉 One class can have many students
👉 class_id is foreign key in student
👉 Student cannot be added without valid class_id

⸻

	•	Teacher → Department (HOD)
👉 hod_id in department references teacher_id
👉 One teacher can be HOD of one department

⸻

	•	Class_Subject_Teacher
👉 Links teacher, subject, and class
👉 teacher_id, subject_id, class_id are foreign keys
👉 Assignment cannot be made without valid IDs

⸻

💻 SOFTWARE USED

Frontend
	•	React → user interface
	•	HTML → structure
	•	CSS (Tailwind) → design
	•	Axios → API calls

Backend
	•	Node.js → runtime
	•	Express → web framework
	•	JWT → authentication
	•	bcrypt → password hashing

Database
	•	MySQL → data storage

Tools
	•	VS Code → code editor
	•	npm → package manager
	•	MySQL Workbench → database management

⸻

🎯 PROJECT REQUIREMENT / EXPECTED OUTCOME

Requirement
	•	Add and manage students, teachers, departments, classes, subjects
	•	Assign teachers to subjects in classes
	•	Maintain relationships using foreign keys
	•	Secure authentication for students and faculty
	•	Store and display data properly

⸻

Expected Outcome
	•	Admin can manage school data easily
	•	Students and teachers are linked with classes and departments
	•	Valid IDs are required for relationships
	•	Department cannot be deleted if classes/teachers exist
	•	System works correctly with proper authentication and data integrity