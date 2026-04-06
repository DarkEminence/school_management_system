import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeePage = () => {
  const [fee, setFee] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/student/fees",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setFee(res.data);
      } catch (err) {
        console.log(err);
        setFee({
          total: 0,
          paid: 0,
          pending: 0,
          dueDate: null,
          status: "Unable to load",
        });
      }
    };

    fetchFee();
  }, [token]);

  const getStatusColor = (status) => {
    return status === "Paid"
      ? "bg-green-500"
      : "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-6 flex justify-center items-center">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-6">

        {/* Back Button */}
        <button
          onClick={() => navigate("/student/studenthome")}
          className="mb-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
        >
          ← Back to Dashboard
        </button>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-purple-700 mb-6">
          Fee Details
        </h2>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-purple-50 p-5 rounded-xl shadow text-center">
            <p className="text-gray-600">Total Amount</p>
            <h3 className="text-xl font-bold text-purple-700">
              ₹ {fee.total || 0}
            </h3>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl shadow text-center">
            <p className="text-gray-600">Paid Amount</p>
            <h3 className="text-xl font-bold text-green-600">
              ₹ {fee.paid || 0}
            </h3>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl shadow text-center">
            <p className="text-gray-600">Pending Amount</p>
            <h3 className="text-xl font-bold text-red-600">
              ₹ {fee.pending || 0}
            </h3>
          </div>

          <div className="bg-purple-50 p-5 rounded-xl shadow text-center">
            <p className="text-gray-600">Due Date</p>
            <h3 className="text-xl font-bold text-purple-700">
              {fee.dueDate || "N/A"}
            </h3>
          </div>

        </div>

        {/* STATUS */}
        <div className="mt-6 text-center">
          <span
            className={`px-6 py-2 rounded-full text-white font-semibold ${getStatusColor(
              fee.status
            )}`}
          >
            {fee.status || "Unknown"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default FeePage;