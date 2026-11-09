import { useState } from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import AccountSuccess from "./pages/AccountSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Login from "./pages/Login";
import InternLogin from "./pages/InternLogin";
import RoleSelection from "./pages/RoleSelection";
import Signup from "./pages/SignUp";
import OtpVerification from "./pages/OtpVerification";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { useEffect } from "react";
import axios from "axios";
import HRDashboard from "./pages/HRDashboard";
import ITDashboard from "./pages/ITDashboard";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem("onboardx-user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}



function App() {

  const [theme, setTheme] = useState(
  localStorage.getItem("onboardx-theme") || "light"
);

const [profilePic, setProfilePic] = useState("");
const [selectedAvatar, setSelectedAvatar] = useState("");
const [user, setUser] = useState(readStoredUser);

const handleAuthenticated = (authenticatedUser) => {
  if (!authenticatedUser) return;
  localStorage.setItem("onboardx-user", JSON.stringify(authenticatedUser));
  setUser(authenticatedUser);
};


useEffect(() => {
  const storedUser = readStoredUser();

  if (!storedUser?.email) return;

  const fetchLatestUser = async () => {
    try {
      const response = await axios.get(
     `http://localhost:5000/api/auth/profile/${storedUser.email}`
    );

setUser(response.data);

if (response.data.profilePic && response.data.profilePic !== "") {
  setProfilePic(
    `http://localhost:5000/uploads/${response.data.profilePic}`
  );
} else {
  setProfilePic(null);
}

if (response.data.selectedAvatar) {
  setSelectedAvatar(response.data.selectedAvatar);
  console.log("Avatar:", response.data.selectedAvatar);
}

localStorage.setItem(
  "onboardx-user",
  JSON.stringify(response.data)
);
    } catch (error) {
      console.error(error);
    }
  };

  fetchLatestUser();
}, []);


const dashboardElement = <EmployeeDashboard
  theme={theme}
  setTheme={setTheme}
  profilePic={profilePic}
  setProfilePic={setProfilePic}
  selectedAvatar={selectedAvatar}
  setSelectedAvatar={setSelectedAvatar}
  user={user}
  setUser= {setUser}
/>;

const hrDashboardElement = (
  <HRDashboard
    theme={theme}
    setTheme={setTheme}
    profilePic={profilePic}
    setProfilePic={setProfilePic}
    selectedAvatar={selectedAvatar}
    setSelectedAvatar={setSelectedAvatar}
    user={user}
    setUser={setUser}
  />
);

const itDashboardElement = (
  <ITDashboard
    theme={theme}
    setTheme={setTheme}
    profilePic={profilePic}
    setProfilePic={setProfilePic}
    selectedAvatar={selectedAvatar}
    setSelectedAvatar={setSelectedAvatar}
    user={user}
    setUser={setUser}
  />
);

  return (
    <div className={theme}>

    <Routes>

      <Route
 path="/"
     element={<RoleSelection />}
/>

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
        path="/intern-login"
        element={<InternLogin onAuthenticated={handleAuthenticated} />}
      />

      <Route
        path="/employee-login"
        element={<Login onAuthenticated={handleAuthenticated} />}
      />
      
      <Route
        path="/otp-verification"
        element={<OtpVerification />}
      />
      
      <Route
      path="/account-success"
      element={<AccountSuccess />}
         />
         

         <Route
  path="/forgot-password"
  element={<ForgotPassword />}
   />
     

     <Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

    <Route path="/select-role" element={<Navigate to="/" replace />} />
    <Route path="/employee-dashboard" element={dashboardElement} />
    <Route
  path="/hr-dashboard"
  element={hrDashboardElement}
/>
    <Route path="/it-dashboard" element={itDashboardElement} />
    <Route path="/manager-dashboard" element={dashboardElement} />
    <Route path="/profile" element={dashboardElement} />
    <Route path="/documents" element={dashboardElement} />
    <Route path="/tasks" element={dashboardElement} />
     <Route
  path="/growth-track"
  element={dashboardElement}
/>
    <Route path="/settings" element={dashboardElement} />
    <Route path="/activity" element={dashboardElement} />

    <Route path="/hr-dashboard/interns" element={hrDashboardElement} />
    <Route path="/hr-dashboard/documents" element={hrDashboardElement} />
    <Route path="/hr-dashboard/assignments" element={hrDashboardElement} />
    <Route path="/hr-dashboard/settings" element={hrDashboardElement} />

    <Route
  path="/hr-dashboard/insights"
  element={hrDashboardElement}
/>

<Route
  path="/it-dashboard"
  element={itDashboardElement}
/>


<Route
  path="/employee-dashboard/it-assets"
  element={<EmployeeDashboard section="itassets" />} />


<Route
  path="/it-dashboard/assets"
  element={itDashboardElement}
/>

<Route
  path="/it-dashboard/access"
  element={itDashboardElement}
/>

<Route
  path="/it-dashboard/requests"
  element={itDashboardElement}
/>


<Route
  path="/it-dashboard/settings"
  element={itDashboardElement}
/>
    </Routes>

      </div>
  );
}

export default App;