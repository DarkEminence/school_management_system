import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResultPage = () => {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/marks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResults(res.data.subjects);
        setSummary(res.data.summary);
      } catch (err) {
        console.log(err);

        // 🔹 Dummy data (for testing without backend)
        setResults([
          { subject: "Maths", internal: 20, assignment: 10, exam: 60, extra: 5 },
          { subject: "Physics", internal: 18, assignment: 9, exam: 55, extra: 4 },
          { subject: "Chemistry", internal: 17, assignment: 8, exam: 50, extra: 3 }
        ]);

        setSummary({
          total: 254,
          percentage: 75,
          internalTotal: 55,
          assignmentTotal: 27
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white grid md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="p-8 md:p-10 space-y-4">
          <button
            onClick={() => navigate("/student/studenthome")}
            className="mb-4 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-semibold transition"
          >
            ← Back to Dashboard
          </button>

          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Student Result
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-indigo-600">
              <p className="text-sm text-slate-600">Total Marks</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {summary.total || 0}
              </h3>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-fuchsia-600">
              <p className="text-sm text-slate-600">Percentage</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {summary.percentage || 0}%
              </h3>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-violet-600">
              <p className="text-sm text-slate-600">Internal Total</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {summary.internalTotal || 0}
              </h3>
            </div>

            <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-indigo-600">
              <p className="text-sm text-slate-600">Assignment Total</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {summary.assignmentTotal || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - TABLE */}
        <div className="p-8 md:p-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 overflow-x-auto">
          <h3 className="text-white text-lg font-bold mb-4">Subject Marks</h3>
          <table className="w-full text-white text-sm">
            <thead className="border-b-2 border-white/30">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold">Subject</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Internal</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Assign</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Exam</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Extra</th>
                <th className="px-3 py-2 text-center text-xs font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {results.map((sub, index) => {
                const total = sub.internal + sub.assignment + sub.exam + sub.extra;
                return (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/10 transition">
                    <td className="px-3 py-2 text-sm font-semibold">{sub.subject}</td>
                    <td className="px-3 py-2 text-center">{sub.internal}</td>
                    <td className="px-3 py-2 text-center">{sub.assignment}</td>
                    <td className="px-3 py-2 text-center">{sub.exam}</td>
                    <td className="px-3 py-2 text-center">{sub.extra}</td>
                    <td className="px-3 py-2 text-center font-bold text-yellow-300">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;