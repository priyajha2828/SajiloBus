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
import AssignmentManagement from "./pages/AssignmentManagement";
import AddRoute from "./pages/AddRoute";
import ViewDriver from "./pages/ViewDriver";
import EditDriver from "./pages/EditDriver";
import ViewBus from "./pages/ViewBus";
import EditBus from "./pages/EditBus";
import ViewPassenger from "./pages/ViewPassenger";
import EditPassenger from "./pages/EditPassenger";
import ViewRoute from "./pages/ViewRoute";
import EditRoute from "./pages/EditRoute";
import AddAssignment from "./pages/AddAssignment";
import EditAssignment from "./pages/EditAssignment";
import ViewAssignment from "./pages/ViewAssignment";
import TripManagement from "./pages/TripManagement";
import AddTrip from "./pages/AddTrip";
import EditTrip from "./pages/EditTrip";
import ViewTrip from "./pages/ViewTrip";
import ScheduleManagement from "./pages/ScheduleManagement";
import AddSchedule from "./pages/AddSchedule";
import EditSchedule from "./pages/EditSchedule";
import ViewSchedule from "./pages/ViewSchedule";

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

      <Route path="/assignments" element={<AssignmentManagement />} />
      <Route path="/passengers/view/:id" element={<ViewPassenger />} />
      <Route path="/schedules" element={<ScheduleManagement />} />
      <Route
  path="/schedules/view/:id"
  element={<ViewSchedule />}
/>

      <Route path="/schedules/add" element={<AddSchedule />} />

      <Route path="/schedules/edit/:id" element={<EditSchedule />} />

      <Route path="/passengers/edit/:id" element={<EditPassenger />} />

      <Route path="/assignments/add" element={<AddAssignment />} />

      <Route path="/routes/view/:id" element={<ViewRoute />} />

      <Route path="/routes/edit/:id" element={<EditRoute />} />

      <Route path="/assignments/edit/:id" element={<EditAssignment />} />

      <Route path="/assignments/view/:id" element={<ViewAssignment />} />

      <Route path="/trips" element={<TripManagement />} />

      <Route path="/trips/add" element={<AddTrip />} />

      <Route path="/trips/edit/:id" element={<EditTrip />} />

      <Route path="/trips/view/:id" element={<ViewTrip />} />

    </Routes>
  );
}

export default App;
