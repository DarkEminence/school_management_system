import Sidebar from "./Sidebar";
import { Routes, Route } from "react-router-dom";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Departments from "./pages/Departments";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";


function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-900 text-white">

      <Sidebar />

      <div className="flex-1 p-6">
        <Routes>
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="departments" element={<Departments />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="assignments" element={<Assignments />} />
        </Routes>
      </div>

    </div>
  );
}

export default AdminDashboard;