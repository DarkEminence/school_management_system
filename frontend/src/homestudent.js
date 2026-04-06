import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomeStudent = () => {
  const [student, setStudent] = useState(null);
  const [news, setNews] = useState([]);
  const [marks, setMarks] = useState(null);
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch student details
        const studentRes = await axios.get(
          "http://localhost:5000/api/student/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch news
        const newsRes = await axios.get(
          "http://localhost:5000/api/announcements"
        );

        // Fetch marks
        const marksRes = await axios.get(
          "http://localhost:5000/api/student/marks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Fetch fees
        const feesRes = await axios.get(
          "http://localhost:5000/api/student/fees",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStudent(studentRes.data);
        setNews(newsRes.data);
        setMarks(marksRes.data);
        setFees(feesRes.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white grid md:grid-cols-2">

        {/* LEFT INFO PANEL */}
        <div className="p-8 md:p-10 space-y-6 bg-white relative">
          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="absolute top-4 left-4 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition text-sm font-medium"
          >
            Logout
          </button>

          <div>
            <h1 className="text-4xl font-extrabold tracking-wide text-slate-900">Student Dashboard</h1>
            <p className="mt-3 text-sm text-slate-500">
              Quick access to your profile, attendance, results, and latest notices.
            </p>
          </div>
          <div className="grid gap-3">
            {[
              { label: "Personal Details", path: "/student/details" },
              { label: "Attendance", path: "/student/attendance" },
              { label: "Result", path: "/student/result" },
              { label: "Fee", path: "/student/fee" }
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="w-full text-left px-5 py-4 bg-slate-100 text-slate-900 rounded-2xl font-semibold hover:bg-slate-200 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">Welcome back,</h3>
            <p className="mt-2 text-slate-600">{student?.name || "Student"}</p>
          </div>

          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700">Announcements</h4>
            <div className="mt-4 space-y-3">
              {news.slice(0, 2).map((item, index) => (
                <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {marks && (
            <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700">Recent Results</h4>
              <div className="mt-4 space-y-3">
                {(marks.subjects || []).slice(0, 2).map((subject, index) => (
                  <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{subject.subject}</p>
                        <p className="text-xs text-slate-500">Internal: {subject.internal} | Assignment: {subject.assignment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-900">{subject.exam}</p>
                        <p className="text-xs text-slate-500">Exam</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="rounded-2xl bg-green-50 p-4 border border-green-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-green-900">Overall Percentage</p>
                    <p className="text-lg font-bold text-green-700">{marks.summary?.percentage ?? 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {fees && (
            <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700">Fee Status</h4>
              <div className="mt-4">
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-slate-600">Total Fees</p>
                    <p className="text-sm font-semibold text-slate-900">₹{fees.total}</p>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-slate-600">Paid</p>
                    <p className="text-sm font-semibold text-green-700">₹{fees.paid}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-600">Pending</p>
                    <p className="text-sm font-semibold text-red-700">₹{fees.pending}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Due Date: {fees.dueDate}</p>
                    <p className={`text-xs font-semibold mt-1 ${fees.status === 'Pending' ? 'text-red-600' : 'text-green-600'}`}>
                      Status: {fees.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT DASHBOARD PANEL */}
        <div className="relative hidden md:block bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white p-8 md:p-10">
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 35%), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.2), transparent 35%)"
          }} />

          <div className="relative space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Student Portal</p>
              <h2 className="mt-3 text-4xl font-extrabold">Welcome Back</h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Email</p>
                <p className="mt-2 text-lg font-semibold text-white">{student?.email || "Not set"}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Course</p>
                <p className="mt-2 text-lg font-semibold text-white">{student?.course || "Not Added"}</p>
              </div>
              {marks && (
                <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                  <p className="text-sm text-purple-100">Overall Grade</p>
                  <p className="mt-2 text-lg font-semibold text-white">{marks.summary?.percentage ?? 0}%</p>
                </div>
              )}
              {fees && (
                <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                  <p className="text-sm text-purple-100">Fee Status</p>
                  <p className="mt-2 text-lg font-semibold text-white">{fees.status}</p>
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
              <h3 className="text-sm text-purple-100">Student Details</h3>
              <div className="mt-4 grid gap-3 text-sm text-purple-100">
                <p><span className="font-semibold">Year:</span> {student?.year || "Not Added"}</p>
                <p><span className="font-semibold">Phone:</span> {student?.phone || "Not Added"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeStudent;