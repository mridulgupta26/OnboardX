import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Signup.css";
import "./AuthExperience.css";
import axios from "axios";


function Signup() {

  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const location = useLocation();
  const role = ["intern", "hr", "it", "manager"].includes(location.state?.role)
    ? location.state.role
    : "intern";
  const roleName = role === "hr" ? "HR" : role === "it" ? "IT" : role === "manager" ? "Manager" : "Intern";
  const [designation, setDesignation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  
const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (fullName.trim() === "") {
      setError("Full Name is required.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const companyDomain = import.meta.env.VITE_COMPANY_EMAIL_DOMAIN || "geminisolutions.com";

    if (role !== "intern" && normalizedEmail.split("@")[1] !== companyDomain.toLowerCase()) {
      setError(`Use your official @${companyDomain} email address.`);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain one lowercase letter.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain one number.");
      return;
    }

    if (!/[@$!%*?&]/.test(password)) {
      setError("Password must contain one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

try {
  await axios.post(
    "http://localhost:5000/api/auth/register",
    {
      fullName,
      email: normalizedEmail,
      password,
      role,
      designation: designation.trim(),
    }
  );

  localStorage.setItem("onboardx-role", role);
  if (role === "intern") {
    navigate("/otp-verification", {
      state: { email: normalizedEmail, role }
    });
  } else {
    navigate("/employee-login", { state: { role } });
  }
} catch (error) {
  setError(
    error.response?.data?.message ||
    "Signup Failed"
  );
}

    // Later:
    // Navigate to OTP Verification Page
  };

  return (
    <div className="login-page auth-form-page auth-signup-page">

      <div className="SignUp-card">

        <div className="left-section">

          <div className="logo">
            OX
          </div>

          <h1>OnboardX</h1>

          <p>Create your onboarding account</p>

        </div>

        <div className="right-section">

          <div className="form-container">

            <h2>{roleName} Sign Up</h2>

            <p className="subtitle">
              {role === "intern"
                ? "Use a personal email. OTP verification is required."
                : `Use your official @${import.meta.env.VITE_COMPANY_EMAIL_DOMAIN || "geminisolutions.com"} email.`}
            </p>

            <form onSubmit={handleSignup}>
               <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
              />

              <label>{role === "intern" ? "Personal Email" : "Official Email"}</label>

              <input
                type="email"
                placeholder={role === "intern" ? "Enter your personal email" : "name@geminisolutions.com"}
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              

              <label>Designation <span className="optional-field">Optional</span></label>

              <input
                type="text"
                placeholder="e.g. Product Design Intern"
                value={designation}
                onChange={(e) =>
                  setDesignation(e.target.value)
                }
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button type="submit">
                Create Account
              </button>

              <p className="signup-text">
                Already have an account?{" "}
                <Link to={role === "intern" ? "/intern-login" : "/employee-login"} state={{ role }} className="signup-link">
                  Login
                </Link>
              </p>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;