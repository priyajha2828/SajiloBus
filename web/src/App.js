import { Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import DriverManagement from "./pages/DriverManagement";
import AddDriver from "./pages/AddDriver";
import { Sidebar } from "lucide-react";
import BusManagement from "./pages/BusManagement";
import AddBus from "./pages/AddBus";
import PassengerManagement from "./pages/PassengerManagement";
import AddPassenger from "./pages/AddPassenger";
import RouteManagement from "./pages/RouteManagement";
import AddRoute from "./pages/AddRoute";
import ViewDriver from "./pages/ViewDriver";
import EditDriver from "./pages/EditDriver";
import ViewBus from "./pages/ViewBus";
import EditBus from "./pages/EditBus";



function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-signup" element={<Signup />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/drivers" element={<DriverManagement />} />
      <Route path="/drivers/add" element={<AddDriver />} />
      <Route path="/buses" element={<BusManagement />} />
      <Route path="/buses/add" element={<AddBus />} />
      <Route path="/passengers" element={<PassengerManagement />} />
      <Route path="/passengers/add" element={<AddPassenger />} />
      <Route path="/routes" element={<RouteManagement />} />
      <Route path="/routes/add" element={<AddRoute />} />
      <Route path="/drivers/view/:id" element={<ViewDriver />} />
      <Route path="/drivers/edit/:id" element={<EditDriver />} />
      <Route path="/buses/view/:id" element={<ViewBus />} />
      <Route path="/buses/edit/:id" element={<EditBus />} />

    </Routes>
  );
}

export default App;