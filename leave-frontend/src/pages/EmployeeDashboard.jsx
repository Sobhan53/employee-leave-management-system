// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../components/Layout";
// import API from "../services/api";

// export default function EmployeeDashboard() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [leaves, setLeaves] = useState([]);
//   const [balance, setBalance] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // 🔐 Auth check
//   useEffect(() => {
//     const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");

//     if (!storedUser) {
//       navigate("/");
//     } else {
//       setUser(storedUser);
//       fetchLeaves();
//       fetchBalance();
//     }
//   }, [navigate]);

//   // 🔥 Fetch leaves
//   const fetchLeaves = async () => {
//     try {
//       const res = await API.get("/my-leaves");

//       const data = res.data.data || [];
//       setLeaves(data);

//     } catch (err) {
//       console.log("Leaves error 👉", err);
//       setLeaves([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔥 Fetch balance
//   const fetchBalance = async () => {
//     try {
//       const res = await API.get("/balance");
//       setBalance(res.data.balance ?? 0);
//     } catch (err) {
//       console.log("Balance error 👉", err);
//       setBalance(0);
//     }
//   };

//   // 🔥 Helper to calculate days
//   const getDays = (start, end) => {
//     return (
//       (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1
//     );
//   };

//   // ✅ CORRECT LOGIC

//   // Only approved days
//   const approvedDays = leaves
//     .filter(l => l.status === "approved")
//     .reduce((sum, l) => sum + getDays(l.start_date, l.end_date), 0);

//   // Only pending days
//   const pendingDays = leaves
//     .filter(l => l.status === "pending")
//     .reduce((sum, l) => sum + getDays(l.start_date, l.end_date), 0);

//   // Optional: total applied (approved + pending only)
//   const totalDays = approvedDays + pendingDays;

//   return (
//     <Layout>

//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">
//           Welcome, {user?.name} 👋
//         </h1>

//         <button
//           onClick={() => navigate("/apply")}
//           className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
//         >
//           Apply Leave
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-4 gap-6 mb-8">

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="text-gray-500">Total Days</h3>
//           <p className="text-3xl font-bold text-indigo-600 mt-2">
//             {totalDays}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="text-gray-500">Approved Days</h3>
//           <p className="text-3xl font-bold text-green-500 mt-2">
//             {approvedDays}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="text-gray-500">Pending Days</h3>
//           <p className="text-3xl font-bold text-yellow-500 mt-2">
//             {pendingDays}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-xl shadow text-center">
//           <h3 className="text-gray-500">Balance</h3>
//           <p className="text-3xl font-bold text-purple-600 mt-2">
//             {balance}
//           </p>
//         </div>

//       </div>

//       {/* Table */}
//       <div className="bg-white p-6 rounded-xl shadow">

//         <h2 className="text-lg font-semibold mb-4">
//           My Leave Requests
//         </h2>

//         {loading ? (
//           <div className="text-center text-gray-500">
//             Loading...
//           </div>
//         ) : leaves.length === 0 ? (
//           <div className="text-center text-gray-400">
//             No leave requests
//           </div>
//         ) : (
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b text-gray-500">
//                 <th className="py-2">Type</th>
//                 <th>Dates</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {leaves.map((l) => {
//                 const days = getDays(l.start_date, l.end_date);

//                 return (
//                   <tr key={l.id} className="border-b">
//                     <td className="py-2 capitalize">
//                       {l.leave_type}
//                     </td>

//                     <td>
//                       {l.start_date} - {l.end_date}
//                       <span className="text-xs text-gray-400 ml-1">
//                         ({days} days)
//                       </span>
//                     </td>

//                     <td>
//                       <span
//                         className={`px-2 py-1 rounded text-white text-sm
//                           ${
//                             l.status === "approved"
//                               ? "bg-green-500"
//                               : l.status === "rejected"
//                               ? "bg-red-500"
//                               : "bg-yellow-500"
//                           }`}
//                       >
//                         {l.status}
//                       </span>

//                       {/* Show rejection reason */}
//                       {l.status === "rejected" && l.manager_comment && (
//                         <div className="text-xs text-red-500 mt-1">
//                           Reason: {l.manager_comment}
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>

//           </table>
//         )}

//       </div>

//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const TOTAL_LEAVES = 20;

  // 🔐 Auth
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user") || "null");

    if (!storedUser) {
      navigate("/");
    } else {
      setUser(storedUser);
      fetchLeaves();
      fetchBalance();
    }
  }, [navigate]);

  // 🔥 Fetch leaves
  const fetchLeaves = async () => {
    try {
      const res = await API.get("/my-leaves");
      setLeaves(res.data.data || []);
    } catch (err) {
      console.log(err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch balance
  const fetchBalance = async () => {
    try {
      const res = await API.get("/balance");
      setBalance(res.data.balance ?? 0);
    } catch {
      setBalance(0);
    }
  };

  // 🔧 Helper
  const getDays = (start, end) =>
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24) + 1;

  // 📊 Calculations
  const approvedDays = leaves
    .filter(l => l.status === "approved")
    .reduce((sum, l) => sum + getDays(l.start_date, l.end_date), 0);

  const pendingDays = leaves
    .filter(l => l.status === "pending")
    .reduce((sum, l) => sum + getDays(l.start_date, l.end_date), 0);

  const totalRequests = leaves.length;

  const progress = (approvedDays / TOTAL_LEAVES) * 100;

  return (
    <Layout>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.name} 👋
        </h1>

        <button
          onClick={() => navigate("/apply")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Apply Leave
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">

        <Card title="Total Leave" value={TOTAL_LEAVES} color="text-indigo-600" />
        <Card title="Approved Days" value={approvedDays} color="text-green-500" />
        <Card title="Pending Days" value={pendingDays} color="text-yellow-500" />
        <Card title="Balance" value={balance} color="text-purple-600" />

      </div>

      {/* Progress Section */}
      <div className="bg-white p-5 rounded-xl shadow mb-6">

        <div className="flex justify-between mb-2 text-sm text-gray-600">
          <span>Leave Usage</span>
          <span>{approvedDays} / {TOTAL_LEAVES}</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-indigo-600 h-3 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-2">
          {approvedDays} / {TOTAL_LEAVES} leaves used
        </p>

      </div>

      {/* Total Requests */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 text-center">
        <h3 className="text-gray-500">Total Requests For Leave</h3>
        <p className="text-2xl font-bold text-indigo-600 mt-1">
          {totalRequests}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-lg font-semibold mb-4">
          My Leave Requests
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : leaves.length === 0 ? (
          <p className="text-center text-gray-400">No requests</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th>Type</th>
                <th>Dates</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {leaves.map(l => {
                const days = getDays(l.start_date, l.end_date);

                return (
                  <tr key={l.id} className="border-b">
                    <td className="capitalize py-2">{l.leave_type}</td>

                    <td>
                      {l.start_date} - {l.end_date}
                      <span className="text-xs text-gray-400 ml-1">
                        ({days} days)
                      </span>
                    </td>

                    <td>
                      <span className={`px-2 py-1 rounded text-white text-sm
                        ${
                          l.status === "approved"
                            ? "bg-green-500"
                            : l.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}>
                        {l.status}
                      </span>

                      {l.status === "rejected" && l.manager_comment && (
                        <div className="text-xs text-red-500 mt-1">
                          Reason: {l.manager_comment}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>

    </Layout>
  );
}

// 🔥 Reusable Card Component
function Card({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}

