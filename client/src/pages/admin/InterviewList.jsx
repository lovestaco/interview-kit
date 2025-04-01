import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  toastErrorStyle,
  toastSuccessStyle,
} from "../../components/utils/toastStyle";
import "../../css/admin/InterviewList.css";

function InterviewList() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin
    if (!localStorage.getItem("isAdmin")) {
      navigate("/");
      return;
    }
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/api/admin/interviews"
      );
      setInterviews(response.data.interviews);
    } catch (error) {
      toast.error("Failed to fetch interviews", { ...toastErrorStyle() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewClick = (id) => {
    navigate(`/admin/interviews/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully", { ...toastSuccessStyle() });
    navigate("/");
  };

  return (
    <div className="admin-container">
      <div className="header-section">
        <h1>Interview Results</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="interview-list">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Job Role</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview, index) => (
                <tr
                  key={interview.id}
                  onClick={() => handleInterviewClick(interview.id)}
                  className="interview-row"
                >
                  <td>{index + 1}</td>
                  <td>{formatDate(interview.created_at)}</td>
                  <td>{interview.user.email}</td>
                  <td>{`${interview.user.first_name} ${interview.user.last_name}`}</td>
                  <td>{interview.user.phone}</td>
                  <td>{interview.applying_for}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default InterviewList;
