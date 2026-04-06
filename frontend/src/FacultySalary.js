import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultySalary = () => {
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty/salary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSalary(res.data);
      } catch (err) {
        console.log(err);
        setError("Unable to load salary details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading salary details...</div>;
  }

  if (!salary) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white p-8 text-center">
          <p className="text-lg font-semibold text-slate-900 mb-4">Salary details unavailable</p>
          <p className="text-sm text-slate-500 mb-6">{error || "There was an issue fetching the salary data."}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 text-white py-3 px-6 font-semibold hover:opacity-95 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
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

          <h2 className="text-3xl font-bold text-slate-900 mb-6">Faculty Salary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl bg-purple-50 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Base Salary</p>
              <p className="mt-2 text-2xl font-semibold text-purple-700">₹ {salary.baseSalary}</p>
            </div>
            <div className="rounded-3xl bg-green-50 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Allowances</p>
              <p className="mt-2 text-2xl font-semibold text-green-700">₹ {salary.allowances}</p>
            </div>
            <div className="rounded-3xl bg-red-50 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Deductions</p>
              <p className="mt-2 text-2xl font-semibold text-red-700">₹ {salary.deductions}</p>
            </div>
            <div className="rounded-3xl bg-indigo-50 p-5 shadow-sm">
              <p className="text-sm text-slate-500">Net Salary</p>
              <p className="mt-2 text-2xl font-semibold text-indigo-700">₹ {salary.netSalary}</p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-slate-700">
            <p className="text-sm text-slate-500">Last Paid</p>
            <p className="mt-2 text-lg font-semibold">{salary.lastPaid ?? "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySalary;
