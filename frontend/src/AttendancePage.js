import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AttendancePage = () => {
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = ["9AM", "10AM", "10:30AM (Break)", "11AM", "12PM", "12:30PM (Lunch)", "1PM", "2PM"];

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/attendance",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAttendance(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="p-8 md:p-10 space-y-4 flex flex-col justify-center">
          <button
            onClick={() => navigate("/student/studenthome")}
            className="mb-4 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-semibold transition w-fit"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Weekly Attendance & Timetable
          </h2>
          <p className="text-slate-600 mb-3">
            View your attendance status organized by day and class time.
          </p>
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-slate-700">Present</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-slate-700">Absent</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - TABLE */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 overflow-x-auto">
          <table className="w-full text-white text-sm">
            <thead className="bg-indigo-700/50 border-b-2 border-white/20">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-white">Day</th>
                {hours.map((hour, idx) => (
                  <th key={idx} className="px-3 py-3 text-center font-semibold text-white text-xs">
                    {hour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIdx) => (
                <tr key={dayIdx} className="border-b border-white/10 hover:bg-white/10 transition">
                  <td className="px-4 py-3 font-semibold text-white">{day}</td>
                  {hours.map((hour, hourIdx) => {
                    const key = `${day}-${hour}`;
                    const status = attendance[key] || "absent";
                    const isBreak = hour.includes("Break") || hour.includes("Lunch");
                    return (
                      <td key={hourIdx} className="px-3 py-3 text-center">
                        {isBreak ? (
                          <div className="text-white/60 text-xs font-semibold">—</div>
                        ) : (
                          <div className={`rounded-lg py-1 px-2 text-xs font-bold ${
                            status === "present" ? "bg-green-500 text-white" : "bg-red-500 text-white"
                          }`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
