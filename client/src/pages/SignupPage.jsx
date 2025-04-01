import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  toastErrorStyle,
  toastSuccessStyle,
} from "../components/utils/toastStyle";
import axios from "axios";
import "../css/SignupPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!Object.values(formData).every((field) => field.trim())) {
      toast.error("All fields are required", { ...toastErrorStyle() });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5000/api/signup",
        formData
      );

      toast.success(response.data.message, { ...toastSuccessStyle() });
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong", {
        ...toastErrorStyle(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
          <button className="submit-button" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                Signing up <FontAwesomeIcon icon={faSpinner} spin />
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
