import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../services/api";

export default function ApplyLeave() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔐 Auth check (sessionStorage)
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "null");

    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  const submit = async () => {
    setError("");
    setSuccess("");

    const { leave_type, start_date, end_date, reason } = form;

    // ✅ Validation
    if (!leave_type || !start_date || !end_date || !reason.trim()) {
      setError("Please fill all fields");
      return;
    }

    if (start_date > end_date) {
      setError("End date must be after start date");
      return;
    }

    try {
      setLoading(true);

      await API.post("/apply-leave", {
        ...form,
        reason: reason.trim()
      });

      setSuccess("Leave Applied Successfully ✅");

      // Reset form
      setForm({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: ""
      });

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);

    } catch (err) {
      console.log("ERROR 👉", err.response);

      const errorData = err?.response?.data;

      setError(
        errorData?.error ||
        errorData?.message ||
        "Something went wrong ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="flex justify-center items-center">

        <div className="bg-white p-8 rounded-2xl shadow-xl w-[420px]">

          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Apply Leave
          </h1>

          {/* Messages */}
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">
              {error}
            </p>
          )}

          {success && (
            <p className="text-green-500 text-sm mb-3 text-center">
              {success}
            </p>
          )}

          {/* Leave Type */}
          <label className="text-sm text-gray-600">Leave Type</label>
          <select
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.leave_type}
            onChange={(e) =>
              setForm({ ...form, leave_type: e.target.value })
            }
          >
            <option value="">Select Leave Type</option>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
          </select>

          {/* Start Date */}
          <label className="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.start_date}
            onChange={(e) =>
              setForm({ ...form, start_date: e.target.value })
            }
          />

          {/* End Date */}
          <label className="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={form.end_date}
            onChange={(e) =>
              setForm({ ...form, end_date: e.target.value })
            }
          />

          {/* Reason */}
          <label className="text-sm text-gray-600">Reason</label>
          <textarea
            className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Enter reason..."
            value={form.reason}
            onChange={(e) =>
              setForm({ ...form, reason: e.target.value })
            }
          />

          {/* Button */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>

        </div>
      </div>

    </Layout>
  );
}

