import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  // ✅ sessionStorage (per tab)
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const logout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white p-6 flex flex-col justify-between">

        <div>
          <h1 className="text-2xl font-bold mb-10 tracking-wide">
            LeaveMS
          </h1>

          <nav className="flex flex-col gap-3 text-sm">

            {/* ✅ Dashboard (role-based) */}
            <Link
              to={user?.role === "manager" ? "/manager" : "/dashboard"}
              className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition"
            >
              🏠 {user?.role === "manager" ? "Manager Dashboard" : "Dashboard"}
            </Link>

            {/* ✅ Apply Leave (ONLY employee) */}
            {user?.role !== "manager" && (
              <Link
                to="/apply"
                className="flex items-center gap-2 p-2 rounded hover:bg-white/10 transition"
              >
                📝 Apply Leave
              </Link>
            )}

          </nav>
        </div>

        {/* User Info */}
        <div className="text-sm text-center opacity-90">
          <p className="font-semibold">{user?.name}</p>
          <p className="text-xs">{user?.email}</p>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              Employee Leave System
            </h2>
            <p className="text-sm text-gray-500">
              Welcome, {user?.name || "User"}
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

        {/* Page Content */}
        <div className="p-6 overflow-auto">
          {children}
        </div>

      </div>
    </div>
  );
}

