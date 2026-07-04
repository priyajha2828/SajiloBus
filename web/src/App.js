import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import DriverManagement from "./pages/DriverManagement";
import AddDriver from "./pages/AddDriver";
import { Sidebar } from "lucide-react";



function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/drivers" element={<DriverManagement />} />
      <Route path="/drivers/add" element={<AddDriver />} />
</Routes>
  );
}

export default App;