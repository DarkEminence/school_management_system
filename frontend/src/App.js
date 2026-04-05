import './index.css';
import { Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";


function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard/*" element={
        <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }/>
    </Routes>
  );
}

export default App;
