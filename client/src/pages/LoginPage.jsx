import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  toastErrorStyle,
  toastSuccessStyle,
} from "../components/utils/toastStyle";
import axios from "axios";
import "../css/LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields", { ...toastErrorStyle() });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/api/signin", {
        email,
        password,
      });

      // Store user data and id separately in localStorage
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("userId", response.data.user.id);

      toast.success(response.data.message, { ...toastSuccessStyle() });

      // Navigate to home page
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong", {
        ...toastErrorStyle(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome to Mock Interview</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <button className="skipButton" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                Signing in <FontAwesomeIcon icon={faSpinner} spin />
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
