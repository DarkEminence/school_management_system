import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="w-64 h-screen flex flex-col bg-slate-800 p-6 border-r border-slate-700 text-white">

      {/* TOP SECTION */}
      <div>
        <h2 className="text-2xl font-bold text-indigo-400 mb-6">
          Admin Panel
        </h2>

        {[
          ["Students", "students"],
          ["Teachers", "teachers"],
          ["Departments", "departments"],
          ["Classes", "classes"],
          ["Subjects", "subjects"],
          ["Assignments", "assignments"], //
        ].map(([name, path]) => (
          <Link
            key={path}
            to={`/admin/dashboard/${path}`}
            className="block px-3 py-2 rounded-lg hover:bg-slate-700 transition"
          >
            {name}
          </Link>
        ))}
      </div>

      {/* 🔽 LOGOUT AT BOTTOM */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition font-semibold"
        >
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;