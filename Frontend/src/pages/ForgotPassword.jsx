import { useState } from "react";
import axios from "axios";
import "./Login.css";
import "./AuthExperience.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

   const handleSendResetLink = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );

      setMessage("Password reset link sent successfully.");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
       "Failed to send reset link"
      );
    }
  };

  return (
    <div className="login-page auth-form-page">
      <div className="login-card">
        <div className="left-section">
          <div className="logo">OX</div>
          <h1>OnboardX</h1>
          <p>Reset your password</p>
        </div>

        <div className="right-section">
          <div className="form-container">
            <h2>Forgot Password</h2>

            <p className="subtitle">
           Enter your registered email address and we'll send you a password reset link.
           </p>

            <form onSubmit={handleSendResetLink}>
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {message && (
                <p className="error-message">
                  {message}
                </p>
              )}

             <button type="submit">
                            Send Reset Link
                </button>
                
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;