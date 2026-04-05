import './index.css';
import LoginPage from './LoginPage';
import { Routes, Route } from "react-router-dom";
import HomeStudent from './homestudent';
import StudentDetails from "./StudentDetails";
import AttendancePage from "./AttendancePage";
import ResultPage from "./ResultPage";
import FeePage from "./FeePage";

/*function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;*/
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/student/studenthome" element={<HomeStudent />} />
      <Route path="/student/details" element={<StudentDetails />} />
      <Route path="/student/attendance" element={<AttendancePage />} />
      <Route path="/student/result" element={<ResultPage />} />
      <Route path="/student/fee" element={<FeePage />} />
    </Routes>
  );
}
export default App;