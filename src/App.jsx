import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import Home from "./components/Home";
import RequireAuth from "./components/RequireAuth";
import GlobalStyle from "./styles/GlobalStyle";
import MyAppointments from "./components/MyAppointments";
import UserManageCalendar from "./components/UserManageCalendar";

function App() {
  return (
    <AuthProvider>
      <GlobalStyle />
      <div className="content">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route
              path="/appointments"
              element={
                <RequireAuth allowedRoles={["USER", "ADMIN"]}>
                  <MyAppointments />
                </RequireAuth>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <RequireAuth allowedRoles={["USER"]}>
                  <UserDashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/user/calendar"
              element={
                <RequireAuth allowedRoles={["USER"]}>
                  <UserManageCalendar />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </RequireAuth>
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
