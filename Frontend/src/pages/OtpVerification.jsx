import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./OtpVerification.css";
import "./AuthExperience.css";

function OtpVerification() {

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(120);
const [timerKey, setTimerKey] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");


  const navigate = useNavigate();

  const location = useLocation();
  const email = location.state?.email;
  const role = location.state?.role || "intern";


  useEffect(() => {
  if (timer === 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);
``


 const handleVerify = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/auth/verify-otp",
      {
        email,
        otp,
      }
    );

    localStorage.setItem("onboardx-role", role);
    navigate(role === "intern" ? "/intern-login" : "/employee-login", {
      state: { role },
    });

  } catch (error) {
  setErrorMessage(
    error.response?.data?.message ||
    "Failed to resend OTP"
  );
}
};

const handleResendOtp = async () => {
  try {
    await axios.post(
      "http://localhost:5000/api/auth/resend-otp",
      {
        email,
      }
    );

    setTimer(120);
    setOtp("");
    setErrorMessage("");

   
  } catch (error) {
  setErrorMessage(
    error.response?.data?.message ||
    "Failed to resend OTP"
  );
}
};

  return (
    <div className="login-page auth-form-page">

      <div className="otp-card">

        <div className="left-section">

          <div className="logo">
            OX
          </div>

          <h1>OnboardX</h1>

          <p>Verify your account</p>

        </div>

        <div className="right-section">

          <div className="form-container">

            <h2>OTP Verification</h2>

            <p className="subtitle">
              Enter the OTP sent to your {role === "intern" ? "personal" : "official"} email
            </p>

            <p
  style={{
    color: timer <= 30 ? "red" : "#2563eb",
    fontWeight: "600",
    marginBottom: "15px",
  }}
>
  OTP Expires In: {Math.floor(timer / 60)}:
  {(timer % 60).toString().padStart(2, "0")}
</p>

           
            
            <div className="otp-box-wrapper">

         <input
        type="text"
        maxLength="6"
        placeholder="123456"
         value={otp}
         onChange={(e)=>setOtp(e.target.value)}
          className="otp-input"
        />

          </div>



          {errorMessage && (
  <p
    style={{
      color: "red",
      textAlign: "center",
      marginTop: "10px",
      fontWeight: "600",
    }}
  >
    {errorMessage}
  </p>
)}

     {timer > 0 && (
  <button onClick={handleVerify}>
    Verify OTP
  </button>
)}


{timer === 0 && (
  <p
    style={{
      color: "red",
      marginTop: "10px",
      fontWeight: "600",
      textAlign: "center",
    }}
  >
    OTP has expired. Please request a new OTP.
  </p>
)}

{timer === 0 && (
  <button
    onClick={handleResendOtp}
    style={{
      marginTop: "10px",
      width: "100%",
    }}
  >
    Resend OTP
  </button>
)}


          </div>

        </div>

      </div>

    </div>
  );
}

export default OtpVerification;