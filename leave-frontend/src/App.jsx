import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ApplyLeave from "./pages/ApplyLeave";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<EmployeeDashboard />} />
        <Route path="/apply" element={<ApplyLeave />} />

        {/* ✅ ALWAYS define route */}
        <Route path="/manager" element={<ManagerDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

