# School Management System

A full-stack web application for managing school operations including student records, faculty management, departments, classes, subjects, and assignments.

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios for API calls
- Tailwind CSS for styling
- Testing Library for testing

### Backend
- Node.js with Express
- MySQL database
- JWT for authentication
- bcrypt for password hashing
- CORS for cross-origin requests

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (version 14 or higher)
- MySQL Server
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd school_management_system
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   ```

## Database Setup

1. Create a MySQL database named `school_management`
2. Update the database credentials in `backend/config/db.js` if necessary (default: root/1234)
3. The application will automatically connect to the database on startup

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   node server.js
   ```
   The server will run on http://localhost:5000

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```
   The app will open in your browser at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/register` - User registration (if implemented)

### Admin Routes
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

- `GET /api/teachers` - Get all teachers
- `POST /api/teachers` - Add new teacher
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

- `GET /api/departments` - Get all departments
- `POST /api/departments` - Add new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

- `GET /api/classes` - Get all classes
- `POST /api/classes` - Add new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Add new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Add new assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

## Features

- User authentication and authorization
- Admin dashboard for managing school data
- Faculty management (details, salary, schedule)
- Student management
- Department and class organization
- Subject and assignment tracking
- Attendance tracking
- Fee management
- Result management

## Project Structure

```
school_management_system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── admin/
│   │       ├── assignments.js
│   │       ├── classes.js
│   │       ├── departments.js
│   │       ├── students.js
│   │       ├── subjects.js
│   │       └── teachers.js
│   ├── check_faculty.js
│   ├── hash.js
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── admin/
    │   │   ├── pages/
    │   │   ├── AdminDashboard.js
    │   │   ├── AdminTable.js
    │   │   └── Sidebar.js
    │   ├── AdminLogin.js
    │   ├── App.js
    │   ├── AttendancePage.js
    │   ├── FacultyDashboard.js
    │   ├── FacultyDetails.js
    │   ├── FacultyManage.js
    │   ├── FacultySalary.js
    │   ├── FacultySchedule.js
    │   ├── FeePage.js
    │   ├── homestudent.js
    │   ├── LoginPage.js
    │   ├── ProtectedRoute.js
    │   ├── ResultPage.js
    │   ├── StudentDetails.js
    │   └── ...
    ├── package.json
    └── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.