import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import "./AuthExperience.css";

function InternLogin({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
          role: "intern",
        }
      );

      if (response.data.role === "intern") {

  localStorage.setItem("onboardx-role", "intern");

  localStorage.setItem(
    "token",
    response.data.token
  );

  onAuthenticated?.(response.data.user);

  navigate("/employee-dashboard", {
    state: { role: "intern" }
  });
}
      else {
        setError("This login is for interns only.");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="login-page auth-form-page">
      <div className="login-card">
        <div className="left-section">
          <div className="logo">Ox</div>

          <h1>OnboardX</h1>
          <p>Your journey begins here</p>
        </div>

        <div className="right-section">
          <div className="form-container">
            <h2>Intern Login</h2>

            <p className="subtitle">
              Sign in with your personal email and password.
            </p>

            <form onSubmit={handleLogin}>
              <label>Personal Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p
  style={{
    textAlign: "right",
    marginTop: "8px",
    marginBottom: "15px",
  }}
>
  <Link
    to="/forgot-password"
    style={{
      color: "#2563eb",
      textDecoration: "none",
      fontWeight: "600",
    }}
  >
    Forgot Password?
  </Link>
</p>
              {error && <p className="error-message">{error}</p>}

              <button type="submit">Login</button>

              <p className="signup-text">
                Need an account?{" "}
                <Link to="/signup" state={{ role: "intern" }} className="signup-link">
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

export default InternLogin;
