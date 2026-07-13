import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../css/AdminLogin.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import api from "../services/api";

import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";

function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Firebase Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firebase ID Token
      const idToken = await userCredential.user.getIdToken();

      // Backend Login
      const response = await api.post("/admin/login", {
        idToken,
      });

      // Save in Redux
      dispatch(
        loginSuccess({
          token: response.data.token,
          admin: response.data.admin,
        })
      );

      // Save in Local Storage
      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      alert("Login Successful");

      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src={logo}
          alt="Vehicle Tracking Logo"
          className="logo"
        />

        <h1>Vehicle Tracking System</h1>

        <h3>Admin Login</h3>

        <form onSubmit={handleSubmit}>
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="options">
            <label className="remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />

              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
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