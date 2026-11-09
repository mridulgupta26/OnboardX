import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import "./AuthExperience.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          password,
        }
      );

      setMessage("Password updated successfully");

      setTimeout(() => {
        navigate("/intern-login");
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="login-page auth-form-page">
      <div className="login-card">
        <div className="left-section">
          <div className="logo">OX</div>

          <h1>OnboardX</h1>

          <p>Create a new password</p>
        </div>

        <div className="right-section">
          <div className="form-container">

            <h2>Reset Password</h2>

            <form onSubmit={handleResetPassword}>

              <label>New Password</label>

              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {message && (
                <p className="error-message">
                  {message}
                </p>
              )}

              <button type="submit">
                Reset Password
              </button>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;