import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { toastErrorStyle } from "../../components/utils/toastStyle";
import "../../css/admin/InterviewDetail.css";
import Markdown from "react-markdown";

function InterviewDetail() {
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("isAdmin")) {
      navigate("/");
      return;
    }
    fetchInterviewDetail();
  }, [id]);

  const fetchInterviewDetail = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/admin/interviews/${id}`
      );
      setInterview(response.data.interview);
    } catch (error) {
      toast.error("Failed to fetch interview details", {
        ...toastErrorStyle(),
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="detail-container">
      <button
        className="back-button"
        onClick={() => navigate("/admin/interviews")}
      >
        Back to List
      </button>
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : interview ? (
        <div className="interview-detail">
          <div className="interview-header">
            <h2>Interview Details</h2>
            <p>Date: {formatDate(interview.created_at)}</p>
            <p>Email: {interview.user.email}</p>
            <p>Job Role: {interview.applying_for}</p>
          </div>
          <div className="interview-result">
            <h3>Review</h3>
            <div className="result-content">
              <Markdown>{interview.result}</Markdown>
            </div>
          </div>
        </div>
      ) : (
        <div>Interview not found</div>
      )}
    </div>
  );
}

export default InterviewDetail;
