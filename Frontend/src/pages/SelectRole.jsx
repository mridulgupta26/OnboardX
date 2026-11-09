import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectRole.css";

function SelectRole() {

  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {

    if (!role) {
      alert("Please select a role");
      return;
    }

    if (role === "hr") {
  navigate("/hr-dashboard");
      }

    if (role === "it") {
  navigate("/it-dashboard");
     }

    if (role === "manager") {
  navigate("/manager-dashboard");
   }

      if (role === "intern") {
  navigate("/employee-dashboard");
        }
  };

  return (

    <div className="success-wrapper">

      <div className="success-popup">

        <h2>Select Your Role</h2>

        <p>
          Choose the role that best describes you.
        </p>

        <div className="role-options">

  <label className={`role-card ${role === "hr" ? "active" : ""}`}>
    <input
      type="radio"
      value="hr"
      checked={role === "hr"}
      onChange={(e) => setRole(e.target.value)}
    />
    👥 HR
  </label>

  <label className={`role-card ${role === "it" ? "active" : ""}`}>
    <input
      type="radio"
      value="it"
      checked={role === "it"}
      onChange={(e) => setRole(e.target.value)}
    />
    💻 IT Team
  </label>

  <label className={`role-card ${role === "manager" ? "active" : ""}`}>
    <input
      type="radio"
      value="manager"
      checked={role === "manager"}
      onChange={(e) => setRole(e.target.value)}
    />
    📊 Manager
  </label>

   <label className={`role-card ${role === "intern" ? "active" : ""}`}>
    <input
      type="radio"
      value="intern"
      checked={role === "intern"}
      onChange={(e) => setRole(e.target.value)}
    />
    🎓 New Employee / Intern
  </label>

       </div>
        <button onClick={handleContinue}>
          Continue
        </button>

      </div>

    </div>

  );
}

export default SelectRole;