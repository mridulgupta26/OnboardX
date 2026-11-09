import { useState } from "react";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AuthExperience.css";

function Login({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const availableRoles = ["hr", "it", "manager"];
  const role = availableRoles.includes(location.state?.role) ? location.state.role : "hr";
  const roleName = role === "hr" ? "HR" : role === "it" ? "IT" : "Manager";

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const companyDomain = import.meta.env.VITE_COMPANY_EMAIL_DOMAIN || "geminisolutions.com";
    const domain = email.trim().toLowerCase().split("@")[1];

    if (domain !== companyDomain.toLowerCase()) {
      setError(`Use your official @${companyDomain} email address.`);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/\d/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[@$!%*?&]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    setError("");

  

try {
  const response = await axios.post(

    "http://localhost:5000/api/auth/login",
    {
      email,
      password,
      role,
    }
  );



  localStorage.setItem("onboardx-role", response.data.role);

 
onAuthenticated?.(response.data.user);

if (response.data.role === "hr") {
  navigate("/hr-dashboard", {
    state: { role: "hr" }
  });
} else if (response.data.role === "it") {
  navigate("/it-dashboard", {
    state: { role: "it" }
  });
} else if (response.data.role === "manager") {
  navigate("/manager-dashboard", {
    state: { role: "manager" }
  });
} else {
  navigate("/employee-dashboard", {
    state: { role: response.data.role }
  });
}


} catch (error) {
  setError(
    error.response?.data?.message ||
    "Login Failed"
  );
}
    
  };

  return (
    <div className="login-page auth-form-page">
      <div className="login-card">
        <div className="left-section">
          <div className="logo">Ox</div>

          <h1>OnboardX</h1>
          <p>Yoconst hanur journey begins here</p>
        </div>

        <div className="right-section">
          <div className="form-container">
            <h2>{roleName} Login</h2>

            <p className="subtitle">
              Sign in to continue your onboarding journey
            </p>

            <form onSubmit={handleLogin}>

              <label>Official Email</label>

              <input
                type="email"
                placeholder="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                className="forgot-password"
                onClick={() => alert("Forgot Password Clicked")}
              >
                Forgot Password?
              </button>

              {error && (
                <p className="error-message">
                  {error}
                </p>
              )}

              <button type="submit">Login</button>

              <p className="signup-text">
                Don't have an account?{" "}
                <Link to="/signup" state={{ role }} className="signup-link">
                  Sign Up
                </Link>
              </p>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;