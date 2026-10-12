import { useState } from "react";
import axios from "axios";
import hospitalBackground from "./assets/hospital-background.png";

function Login({ setPage, setLoggedInPatient }) {
  const [loginData, setLoginData] = useState({
    name: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/patients/login",
        loginData
      );

      alert("Login successful!");

      setLoggedInPatient(response.data.patient);
      setPage("dashboard");
    } catch (error) {
      console.error("Login error:", error);

      alert(
        error.response?.data?.message ||
          "Login failed. Please check your name and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section
        className="login-visual"
        style={{
          backgroundImage: `url(${hospitalBackground})`,
        }}
      >
        <div className="visual-overlay"></div>

        <div className="hospital-brand">
          <div className="hospital-logo">
            <span className="logo-horizontal"></span>
            <span className="logo-vertical"></span>
          </div>

          <div className="hospital-name">
            <span className="hospital-name-main">
              AI Hospital
            </span>

            <span className="hospital-name-accent">
              Queue
            </span>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE */}
      <section className="login-section">

        <div className="login-card">

          {/* HEADER */}
          <div className="login-header">

            <div className="login-label">
              <span>PATIENT PORTAL</span>
              <div></div>
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to access your hospital
              <br />
              queue dashboard.
            </p>

          </div>

          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* NAME */}
            <div className="form-group">

              <label htmlFor="patient-name">
                Patient Name
              </label>

              <div className="input-wrapper">

                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="8"
                    r="4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M4 21c0-4 3.5-7 8-7s8 3 8 7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="patient-name"
                  type="text"
                  placeholder="Enter your name"
                  value={loginData.name}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      name: e.target.value,
                    })
                  }
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label htmlFor="patient-password">
                Password
              </label>

              <div className="input-wrapper">

                <svg
                  className="input-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <rect
                    x="5"
                    y="10"
                    width="14"
                    height="10"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 10V7a4 4 0 018 0v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="patient-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      password: e.target.value,
                    })
                  }
                  required
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />

                    <circle
                      cx="12"
                      cy="12"
                      r="2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                  </svg>
                </button>

              </div>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>
                {loading ? "Signing in..." : "Login"}
              </span>

              {!loading && (
                <span className="login-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          {/* REGISTER */}
          <div className="register-section">

            <div className="register-divider">

              <span></span>

              <p>
                Don't have an account?
              </p>

              <span></span>

            </div>

            <button
              type="button"
              className="create-account-button"
              onClick={() => setPage("register")}
            >
              Create Account
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Login;