import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const ADMIN_USER = "admin";
    const ADMIN_PASS = "admin123";

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        localStorage.setItem("adminLoggedIn", "true");
navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials");
      }
      setLoading(false);
    }, 500); // small delay for UX
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-slate-800 grid md:grid-cols-2">

      {/* Left side (form) */}
      <form onSubmit={onSubmit} className="p-8 md:p-10 space-y-4">
        <h2 className="text-4xl font-extrabold tracking-wide text-white">ADMIN LOGIN</h2>

        {error && <p className="text-sm text-red-400">{error}</p>}

        {/* Username */}
        <input
          className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm placeholder-gray-400"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-fuchsia-500 text-sm placeholder-gray-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          disabled={loading}
          className="w-full text-white py-3 rounded-lg font-semibold bg-gradient-to-r from-fuchsia-600 to-indigo-700 hover:opacity-95 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {/* Right side UI */}
      <div className="relative hidden md:flex items-center px-10 bg-gradient-to-br from-black via-slate-900 to-slate-800 text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.15), transparent 35%), radial-gradient(circle at 40% 85%, rgba(255,255,255,0.1), transparent 35%)"
          }}
        />
        <div className="relative">
          <p className="text-2xl font-medium mb-1 text-gray-300">Admin Panel</p>
          <h3 className="text-5xl font-extrabold leading-tight tracking-wide">
            Secure Access
          </h3>
        </div>
      </div>

    </div>
  </div>
);
}

export default AdminLogin;