import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("student");

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
        role: selectedRole, // future use
      });

      // store token (for next step)
      localStorage.setItem("token", res.data.token);

      // redirect based on role
      if (selectedRole === "faculty") {
        navigate("/faculty/dashboard");
      } else {
        navigate("/student/dashboard");
      }

    } catch (err) {
      setError(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.15)] bg-white grid md:grid-cols-2">

        <form onSubmit={onSubmit} className="p-8 md:p-10 space-y-4">
          <h2 className="text-4xl font-extrabold tracking-wide text-slate-900">LOGIN</h2>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {/* Role selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            {["student", "faculty"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                  selectedRole === role
                    ? "bg-white text-indigo-700 shadow"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Email */}
          <input
            className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            className="w-full border border-slate-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-400 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Button */}
          <button
            disabled={loading}
            className="w-full text-white py-3 rounded-lg font-semibold bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Right side UI */}
        <div className="relative hidden md:flex items-center px-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 text-white overflow-hidden">
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 35%), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.2), transparent 35%)"
            }}
          />
          <div className="relative">
            <p className="text-2xl font-medium mb-1">Hey</p>
            <h3 className="text-5xl font-extrabold leading-tight tracking-wide">Welcome Back</h3>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;