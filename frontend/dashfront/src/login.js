import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import BASE_URL from "./config";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.password) {
      setError("Both fields are required.");
      return;
    }

    try {
      const result = await axios.post(`${BASE_URL}/api/login/`, {
        username: formData.userName,
        password: formData.password,
      });

      console.log("API Response:", result.data);

      if (result.data.access) {
        localStorage.setItem("token", result.data.access);  // Store token
        navigate("/dashboard");  // Redirect after login
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="login-header box-shadow">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="brand-logo">
            <a href="">
             
            </a>
          </div>
          <div className="input-group mb-0">
  <button 
    onClick={() => navigate("/register")} 
    className="btn btn-outline-primary btn-lg btn-block"
  >
    Register To Create Account
  </button>
</div>

        </div>
      </div>
      <div className="login-wrap d-flex align-items-center flex-wrap justify-content-center">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-7">
              <img src="vendors/images/login-page-img.png" alt="" />
            </div>
            <div className="col-md-6 col-lg-5">
              <div className="login-box bg-white box-shadow border-radius-10">
                <div className="login-title">
                  <h2 className="text-center text-primary">Login To DeskApp</h2>
                </div>
                <form onSubmit={handleLogin}>
                  {/* Role Selection */}
                  <div className="select-role">
                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                      <label className="btn active">
                        <input
                          type="radio"
                          name="role"
                          value="manager"
                          onChange={handleChange}
                        />
                        <div className="icon">
                          <img
                            src="vendors/images/briefcase.svg"
                            className="svg"
                            alt=""
                          />
                        </div>
                        <span>I'm</span> Manager
                      </label>
                      <label className="btn">
                        <input
                          type="radio"
                          name="role"
                          value="employee"
                          onChange={handleChange}
                        />
                        <div className="icon">
                          <img
                            src="vendors/images/person.svg"
                            className="svg"
                            alt=""
                          />
                        </div>
                        <span>I'm</span> Employee
                      </label>
                    </div>
                  </div>
                  {/* Username Input */}
                  <div className="input-group custom">
                    <input
                      type="text"
                      name="userName"
                      className="form-control form-control-lg"
                      placeholder="Username"
                      onChange={handleChange}
                      value={formData.userName}
                    />
                    <div className="input-group-append custom">
                      <span className="input-group-text">
                        <i className="icon-copy dw dw-user1" />
                      </span>
                    </div>
                  </div>
                  {/* Password Input */}
                  <div className="input-group custom">
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      required
                      placeholder="**********"
                      onChange={handleChange}
                      value={formData.password}
                    />
                    <div className="input-group-append custom">
                      <span className="input-group-text">
                        <i className="dw dw-padlock1" />
                      </span>
                    </div>
                  </div>
                  {/* Error Message */}
                  {error && <div className="error-message">{error}</div>}
                  <div className="row pb-30">
                    <div className="col-6">
                      <div className="custom-control custom-checkbox">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="customCheck1"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="customCheck1"
                        >
                          Remember
                        </label>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="forgot-password">
                        <a href="forgot-password.html">Forgot Password</a>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-12">
                      <button
                        className="btn btn-primary btn-lg btn-block"
                        type="submit"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                  <div
                    className="font-16 weight-600 pt-10 pb-10 text-center"
                    data-color="#707373"
                  >
                    OR
                  </div>
                  <div className="input-group mb-0">
                    <a
                      className="btn btn-outline-primary btn-lg btn-block"
                      href="register"
                    >
                      Register To Create Account
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
