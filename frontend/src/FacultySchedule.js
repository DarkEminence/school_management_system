import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty/schedule", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedule(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading schedule...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white">
        <div className="p-6">
          <button
            onClick={() => navigate("/faculty/dashboard")}
            className="mb-4 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 transition"
          >
            ← Back to Dashboard
          </button>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">Faculty Schedule</h2>

          <div className="grid gap-4">
            {schedule.map((item, index) => (
              <div key={index} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{item.day}</p>
                <h3 className="text-xl font-semibold text-slate-900">{item.subject}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.slot}</p>
                <p className="mt-1 text-sm text-slate-600">Room: {item.room}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySchedule;
