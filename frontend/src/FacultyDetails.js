import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FacultyDetails = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    designation: "",
    phone: "",
    address: "",
    dob: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faculty/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/faculty/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Details saved successfully");
      navigate("/faculty/dashboard");
    } catch (err) {
      console.log(err);
      alert("Error saving data");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white grid md:grid-cols-2">
        <div className="p-8 md:p-10 space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Faculty Personal Details</h2>

          <button
            onClick={() => navigate("/faculty/dashboard")}
            className="mb-4 px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400 font-semibold transition"
          >
            ← Back to Dashboard
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" disabled />
            <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" />
            <input name="designation" value={form.designation} onChange={handleChange} placeholder="Designation" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" />
            <input name="dob" value={form.dob} onChange={handleChange} type="date" className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm" />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm"
            />

            <button type="submit" className="w-full text-white py-3 rounded-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:opacity-95">
              Save Details
            </button>
          </form>
        </div>

        <div className="relative hidden md:flex items-center px-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 35%), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.2), transparent 35%)"
          }} />
          <div className="relative">
            <p className="text-2xl font-medium mb-1">Manage</p>
            <h3 className="text-5xl font-extrabold leading-tight tracking-wide">Faculty Profile</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDetails;
