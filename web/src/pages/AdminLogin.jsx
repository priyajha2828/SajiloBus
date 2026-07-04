import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  // Temporary login until backend is ready
  navigate("/admin/dashboard");
};
  return (
    <div className="login-page">

      <div className="login-card">

        <img src={logo} alt="Vehicle Tracking Logo" className="logo" />

        <h1>Vehicle Tracking System</h1>
        <h3>Admin Login</h3>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash/> : <FaEye/>}
            </button>

          </div>

          <div className="options">

            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e)=>setRemember(e.target.checked)}
              />

              Remember me
            </label>

            <Link to="/forgot-password">
  Forgot Password?
</Link>

          </div>

          <button className="login-btn">
            Login
          </button>

        </form>

        <p className="signup">
  Don't have an account?
  <Link to="/admin-signup"> Sign Up</Link>
</p>

      </div>

    </div>
  );
}

export default AdminLogin;