import { useNavigate } from "react-router-dom";
import "./AccountSuccess.css";

function AccountSuccess() {

  const navigate = useNavigate();

  return (
    <div className="success-wrapper">

      <div className="success-popup">

        <div className="success-icon">
          ✅
        </div>

        <h1>Account Verified</h1>

        <p>
          Your account has been verified successfully.
        </p>

        <button
          onClick={() => navigate("/intern-login")}
        >
          Continue
        </button>

      </div>

    </div>
  );
}

export default AccountSuccess;