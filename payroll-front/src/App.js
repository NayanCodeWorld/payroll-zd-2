import "./App.css";
import SideBar from "./components/Sidebar/SideBar";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Salary from "./pages/Salary";
import Dashboard from "./pages/Dashboard";
import AddEmployee from "./pages/Employee/AddEmployee";
import ManageEmpyee from "./pages/Employee/manageEmpyee";
import EmpEdit from "./pages/Employee/EmpEdit";
import EmpDetail from "./pages/Employee/EmpDetail";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Leaves from "./pages/Leaves/Leave";
import LeaveDetails from "./pages/Leaves/LeaveDetails";
import UserLeaveDetails from "./pages/Leaves/UserLeaveDetails";
import Downloadslip from "./pages/Salary_slip/downloadslip";
import Year_Leave from "./pages/Leaves/Year_Leave";
import Year_Leave_Details from "./pages/Leaves/Year_leave_details";
import LoginPage from "./Auth/LoginPage";
import { useEffect, useState } from "react";
import TotalHolydays from "./pages/Holydays/TotalHolydays";
import TotalPresent from "./pages/Leaves/TotalPresent";
import Logout from "./Auth/Logout"
import ChangePassword from "./pages/components/ChangePassword";
import YesterdayApsent from "./pages/Leaves/YesterdayApsent";
function App() {
  const token = localStorage.getItem("token");
  // console.log("---Token---", token);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };
  useEffect(() => {
    let inactivityTimeout;

    const handleUserActivity = () => {
      clearTimeout(inactivityTimeout); // Reset the timeout on each user activity
      inactivityTimeout = setTimeout(() => {
        // Perform token removal from local storage here
        localStorage.removeItem('token');
        window.location.reload()
        // Redirect to the login page or perform any other necessary actions
        // e.g., using React Router: history.push('/login');
      }, 5 * 60 * 1000); // 5 minutes (in milliseconds)
    };

    // Attach event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(inactivityTimeout);
    };
  }, []);
  return (
    <Router>
      {!token ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <SideBar>
          <Routes>
            <Route path="/employee/salary:id" element={<Salary />} />
            <Route path="/employee/profile" element={<AddEmployee />} />
            <Route path="/employee/manageprofile" element={<ManageEmpyee />} />
            <Route path="/employee/EmpEdit:id" element={<EmpEdit />} />
            <Route path="/employee/EmpDetail:id" element={<EmpDetail />} />
            <Route path="/employee/leave" element={<Leaves />} />
            <Route path="/employee/leavedetails" element={<LeaveDetails />} />
            <Route path="/employee/userleavedetails:id" element={<UserLeaveDetails />} />
            <Route path="/download/:id" element={<Downloadslip />} />
            <Route path="/Year_leave" element={<Year_Leave />} />
            <Route path="/year_leavedetails" element={<Year_Leave_Details />} />
            <Route path="/holiydays" element={<TotalHolydays />} />
            <Route path="/TotalPresent" element={<TotalPresent />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/change_password" element={<ChangePassword />} />
            <Route path="/Logout" element={<Logout />} />
            <Route path="/YesterdayApsent" element={<YesterdayApsent />} />
          </Routes>
        </SideBar>
      )}
    </Router>
  );
}

export default App;
