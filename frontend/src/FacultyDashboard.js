import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("http://localhost:5000/api/faculty/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const announcementsRes = await axios.get("http://localhost:5000/api/announcements");

        const classesRes = await axios.get("http://localhost:5000/api/faculty/classes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(profileRes.data);
        setAnnouncements(announcementsRes.data);
        setClasses(classesRes.data);
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

        <div className="p-8 md:p-10 space-y-6 bg-white relative">
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
            <h1 className="text-4xl font-extrabold tracking-wide text-slate-900">Faculty Dashboard</h1>
            <p className="mt-3 text-sm text-slate-500">
              Quick access to your profile, schedule, salary, and latest announcements.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              { label: "Personal Details", path: "/faculty/details" },
              { label: "Schedule", path: "/faculty/schedule" },
              { label: "Salary", path: "/faculty/salary" },
              { label: "Manage Classes", path: "/faculty/manage" },
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
            <p className="mt-2 text-slate-600">{profile?.name || "Faculty"}</p>
          </div>

          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700">Announcements</h4>
            <div className="mt-4 space-y-3">
              {announcements.slice(0, 2).map((item, index) => (
                <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 p-5 rounded-3xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700">Your Classes</h4>
            <div className="mt-4 space-y-3">
              {classes.length === 0 ? (
                <p className="text-xs text-slate-500">No classes assigned yet.</p>
              ) : (
                classes.slice(0, 3).map((cls, index) => (
                  <div key={index} className="rounded-2xl bg-white p-4 shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{cls.class_name}</p>
                        <p className="text-xs text-slate-500">{cls.course} • {cls.subject}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">Students</p>
                        <p className="text-sm font-semibold text-slate-900">{cls.student_count}</p>
                      </div>
                    </div>
                    {cls.is_tutorship && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        Tutorship Class
                      </span>
                    )}
                  </div>
                ))
              )}
              {classes.length > 3 && (
                <p className="text-xs text-slate-500 text-center">+{classes.length - 3} more classes</p>
              )}
            </div>
          </div>
        </div>

        <div className="relative hidden md:block bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white p-8 md:p-10">
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 35%), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.2), transparent 35%)"
          }} />

          <div className="relative space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-200">Faculty Portal</p>
              <h2 className="mt-3 text-4xl font-extrabold">Welcome Back</h2>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Email</p>
                <p className="mt-2 text-lg font-semibold text-white">{profile?.email || "Not set"}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Department</p>
                <p className="mt-2 text-lg font-semibold text-white">{profile?.department || "Not Added"}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Total Classes</p>
                <p className="mt-2 text-lg font-semibold text-white">{classes.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
                <p className="text-sm text-purple-100">Total Students</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {classes.reduce((total, cls) => total + (cls.student_count || 0), 0)}
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white/10 p-5 border border-white/10">
              <h3 className="text-sm text-purple-100">Faculty Details</h3>
              <div className="mt-4 grid gap-3 text-sm text-purple-100">
                <p><span className="font-semibold">Designation:</span> {profile?.designation || "Not Added"}</p>
                <p><span className="font-semibold">Phone:</span> {profile?.phone || "Not Added"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
