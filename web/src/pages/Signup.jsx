import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../css/Signup.css";
import logo from "../assets/logo.png";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);

    // TODO
    // Call your Node.js Register API
  };

  return (
    <div className="signup-page">

      <div className="signup-card">

        <img src={logo} alt="Vehicle Tracking Logo" className="logo" />

        <h1>Vehicle Tracking System</h1>

        <h3>Signup to Continue</h3>

        <form onSubmit={handleSubmit}>

          <label>Name *</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Email *</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Contact No *</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter your Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <label>Password *</label>

          <div className="password-box">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>

          </div>

          <div className="remember-row">

            <label className="remember">

              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />

              Remember me

            </label>

          </div>

          <button className="signup-btn">
            Signup
          </button>

        </form>

        <p className="login-link">
          <Link to="/admin-login">
            Back to Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;