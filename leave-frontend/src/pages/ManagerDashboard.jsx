// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Layout from "../components/Layout";
// import API from "../services/api";

// export default function ManagerDashboard() {
//   const navigate = useNavigate();

//   const [leaves, setLeaves] = useState([]);
//   const [filteredLeaves, setFilteredLeaves] = useState([]);
//   const [comments, setComments] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [view, setView] = useState("pending"); // pending | all

//   // 🔐 Protect route
//   useEffect(() => {
//     const user = JSON.parse(sessionStorage.getItem("user") || "null");

//     if (!user) {
//       navigate("/");
//     } else if (user.role !== "manager") {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   // 🔥 Fetch data
//   const fetchLeaves = async () => {
//     try {
//       setLoading(true);

//       let res;

//       if (view === "pending") {
//         res = await API.get("/pending-leaves");
//       } else {
//         res = await API.get("/leaves"); // requires index() in backend
//       }

//       console.log("Manager API 👉", res.data);

//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data.data || [];

//       setLeaves(data);
//       setFilteredLeaves(data);

//     } catch (err) {
//       console.log("Fetch error 👉", err);
//       setLeaves([]);
//       setFilteredLeaves([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLeaves();
//   }, [view]);

//   // 🔥 Update status
//   const update = async (id, status) => {
//     try {
//       await API.post(`/leave-status/${id}`, {
//         status,
//         comment: comments[id] || ""
//       });

//       fetchLeaves(); // refresh
//     } catch (err) {
//       console.log("Update error 👉", err);
//     }
//   };

//   // 🔥 Stats
//   const total = leaves.length;
//   const pending = leaves.filter(l => l.status === "pending").length;
//   const approved = leaves.filter(l => l.status === "approved").length;
//   const rejected = leaves.filter(l => l.status === "rejected").length;

//   return (
//     <Layout>

//       <h1 className="text-2xl font-bold mb-6 text-gray-800">
//         Manager Dashboard
//       </h1>

//       {/* 📊 Stats */}
//       <div className="grid grid-cols-4 gap-4 mb-6">

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-500 text-sm">Total</p>
//           <p className="text-2xl font-bold text-indigo-600">{total}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-500 text-sm">Pending</p>
//           <p className="text-2xl font-bold text-yellow-500">{pending}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-500 text-sm">Approved</p>
//           <p className="text-2xl font-bold text-green-500">{approved}</p>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow text-center">
//           <p className="text-gray-500 text-sm">Rejected</p>
//           <p className="text-2xl font-bold text-red-500">{rejected}</p>
//         </div>

//       </div>

//       {/* 🔁 Toggle */}
//       <div className="flex gap-3 mb-6">
//         <button
//           onClick={() => setView("pending")}
//           className={`px-4 py-2 rounded ${
//             view === "pending"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Pending
//         </button>

//         <button
//           onClick={() => setView("all")}
//           className={`px-4 py-2 rounded ${
//             view === "all"
//               ? "bg-indigo-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           All Requests
//         </button>
//       </div>

//       {/* 📋 List */}
//       {loading ? (
//         <p className="text-center text-gray-500">Loading...</p>
//       ) : filteredLeaves.length === 0 ? (
//         <p className="text-center text-gray-500 mt-10">
//           No requests found 🎉
//         </p>
//       ) : (
//         <div className="space-y-4">

//           {filteredLeaves.map((l) => (
//             <div
//               key={l.id}
//               className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
//             >

//               {/* Top */}
//               <div className="flex justify-between items-center">
//                 <h2 className="font-semibold text-lg capitalize">
//                   {l.leave_type}
//                 </h2>

//                 <span className="text-sm text-gray-500">
//                   {l.start_date} → {l.end_date}
//                 </span>
//               </div>

//               {/* Employee */}
//               {l.user && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   👤 {l.user.name}
//                 </p>
//               )}

//               {/* Reason */}
//               <p className="text-gray-600 mt-2 text-sm">
//                 {l.reason}
//               </p>

//               {/* Status */}
//               <span
//                 className={`inline-block mt-2 px-2 py-1 text-xs rounded text-white
//                   ${
//                     l.status === "approved"
//                       ? "bg-green-500"
//                       : l.status === "rejected"
//                       ? "bg-red-500"
//                       : "bg-yellow-500"
//                   }`}
//               >
//                 {l.status.toUpperCase()}
//               </span>

//               {/* Comment Input */}
//               {l.status === "pending" && (
//                 <textarea
//                   placeholder="Add comment (optional)"
//                   value={comments[l.id] || ""}
//                   onChange={(e) =>
//                     setComments({
//                       ...comments,
//                       [l.id]: e.target.value
//                     })
//                   }
//                   className="w-full mt-3 p-2 border rounded text-sm"
//                 />
//               )}

//               {/* Actions */}
//               {l.status === "pending" && (
//                 <div className="mt-4 flex gap-3">
//                   <button
//                     onClick={() => update(l.id, "approved")}
//                     className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
//                   >
//                     Approve
//                   </button>

//                   <button
//                     onClick={() => update(l.id, "rejected")}
//                     className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}

//               {/* Rejection Reason */}
//               {l.status === "rejected" && l.manager_comment && (
//                 <p className="text-xs text-red-500 mt-2">
//                   Reason: {l.manager_comment}
//                 </p>
//               )}

//             </div>
//           ))}

//         </div>
//       )}

//     </Layout>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("pending"); // pending | all

  // 🔐 Role protection
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    if (!user) {
      navigate("/");
    } else if (user.role !== "manager") {
      navigate("/dashboard");
    }
  }, [navigate]);

  // 🔥 ALWAYS fetch ALL leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leaves"); // ✅ always all data

      console.log("ALL DATA 👉", res.data);

      const data = res.data.data || [];
      setLeaves(data);

    } catch (err) {
      console.log("Fetch error 👉", err);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // 🔥 Filter based on toggle
  useEffect(() => {
    if (view === "pending") {
      setFilteredLeaves(leaves.filter(l => l.status === "pending"));
    } else {
      setFilteredLeaves(leaves);
    }
  }, [view, leaves]);

  // 🔥 Update status
  const update = async (id, status) => {
    try {
      await API.post(`/leave-status/${id}`, {
        status,
        comment: comments[id] || ""
      });

      fetchLeaves(); // refresh
    } catch (err) {
      console.log("Update error 👉", err);
    }
  };

  // 🔥 Stats (from ALL data)
  const total = leaves.length;
  const pending = leaves.filter(l => l.status === "pending").length;
  const approved = leaves.filter(l => l.status === "approved").length;
  const rejected = leaves.filter(l => l.status === "rejected").length;

  return (
    <Layout>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manager Dashboard
      </h1>

      {/* 📊 Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-indigo-600">{total}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{pending}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Approved</p>
          <p className="text-2xl font-bold text-green-500">{approved}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{rejected}</p>
        </div>

      </div>

      {/* 🔁 Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setView("pending")}
          className={`px-4 py-2 rounded ${
            view === "pending"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setView("all")}
          className={`px-4 py-2 rounded ${
            view === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All Requests
        </button>
      </div>

      {/* 📋 List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : filteredLeaves.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No requests found 🎉
        </p>
      ) : (
        <div className="space-y-4">

          {filteredLeaves.map((l) => (
            <div
              key={l.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >

              {/* Top */}
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg capitalize">
                  {l.leave_type}
                </h2>

                <span className="text-sm text-gray-500">
                  {l.start_date} → {l.end_date}
                </span>
              </div>

              {/* Employee */}
              {l.user && (
                <p className="text-sm text-gray-600 mt-1">
                  👤 {l.user.name}
                </p>
              )}

              {/* Reason */}
              <p className="text-gray-600 mt-2 text-sm">
                {l.reason}
              </p>

              {/* Status */}
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs rounded text-white
                  ${
                    l.status === "approved"
                      ? "bg-green-500"
                      : l.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
              >
                {l.status.toUpperCase()}
              </span>

              {/* Comment Input */}
              {l.status === "pending" && (
                <textarea
                  placeholder="Add comment (optional)"
                  value={comments[l.id] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [l.id]: e.target.value
                    })
                  }
                  className="w-full mt-3 p-2 border rounded text-sm"
                />
              )}

              {/* Actions */}
              {l.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => update(l.id, "approved")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => update(l.id, "rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {/* Rejection reason */}
              {l.status === "rejected" && l.manager_comment && (
                <p className="text-xs text-red-500 mt-2">
                  Reason: {l.manager_comment}
                </p>
              )}

            </div>
          ))}

        </div>
      )}

    </Layout>
  );
}



