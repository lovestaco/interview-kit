import React, { useEffect, useState, useContext, useRef } from "react";
import "../css/ReviewPageNew.css";
import Markdown from "react-markdown";
import axios from "axios";
import { toast } from "react-toastify";
import { toastErrorStyle } from "../components/utils/toastStyle";
import { GlobalContext } from "../components/utils/GlobalState";
import Canvas3D from "../components/utils/Canvas3D";
import { useNavigate } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

function ReviewPage() {
  // access global values and functions
  const {
    gJobRole,
    gQtns,
    gAns,
    gEmotionData,
    gValidReview,
    gSuspiciousCount,
  } = useContext(GlobalContext);
  // Get userId from localStorage
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [review, setReview] = useState("");
  const [displayText, setDisplayText] = useState("");
  const hasFetchedReview = useRef(false); // UseRef to track API call

  useEffect(() => {
    if (!gValidReview || !userId) {
      window.location.replace("/");
    }
  }, [gValidReview, userId]);

  useEffect(() => {
    if (gAns.length > 0 && review === "" && !hasFetchedReview.current) {
      hasFetchedReview.current = true; // Mark as fetched before calling API
      getReview();
    }
  }, [gAns, review]);

  const getReview = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/get-review",
        {
          job_role: gJobRole,
          qns: gQtns,
          ans: gAns,
          emotion: gEmotionData,
          suspiciousCount: gSuspiciousCount,
          userId: parseInt(userId),
        }
      );

      setReview(response.data.review);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong", {
        ...toastErrorStyle(),
        autoClose: 2000,
      });
      console.error(
        "Error generating review:",
        error.response?.data?.errorMsg || error.message
      );
    }
  };

  // typing effect--------------
  useEffect(() => {
    if (review) {
      let count = 0;
      let temp = "";
      let speed = review.length > 1000 ? 20 : 40;
      const intervalId = setInterval(() => {
        if (count >= review.length) {
          clearInterval(intervalId);
          return;
        }

        temp += review[count];
        setDisplayText(temp);
        count++;
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [review]);

  const gotoHomePage = () => {
    navigate("/home", { replace: true });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <div className="review-main-div">
      {/* Review display part */}
      <div className="left-main-div">
        {review.length <= 0 ? (
          <div className="loading-div">
            <Canvas3D
              pos={[0, -3, 0]}
              scale={[6.5, 6.5, 6.5]}
              modelPath={"/robot1.glb"}
              classname={"robotloading"}
            />
            <center>
              <h1>Generating Review...</h1>
            </center>
          </div>
        ) : (
          <div className="review-text-mainDiv">
            <div className="robotImage-div">
              <Canvas3D
                pos={[0, -3, 0]}
                scale={[6.7, 6.7, 6.7]}
                modelPath={"/robot1.glb"}
                classname={"robotImage"}
              />
              <h1>FeedBack</h1>
            </div>
            <div className="review-text-wrapper">
              <Markdown
                className="review-text"
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={dark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {displayText}
              </Markdown>
            </div>
          </div>
        )}
      </div>

      <div className="right-main-div">
        <div className="right-content1-main">
          <div className="right-content1-sub1">
            <div className="right-content1-sub1-text">
              <p>
                Thank You <br />
                for choosing our
                <br /> Interview Kit
              </p>
            </div>
            <div className="right-content1-sub1-model">
              <Canvas3D
                pos={[0, 0, 0]}
                scale={[0.015, 0.015, 0.015]}
                modelPath={"/rubix_cube2.glb"}
                classname={"threeD_model"}
                preset={"apartment"}
                camControls={true}
              />
            </div>
          </div>
          <div className="right-content1-sub2">
            <p>
              Hey there! Thanks for picking our Interview Kit to help you get
              interview-ready. We're here to give you a real feel of what it's
              like to sit through interviews, minus the stress. Whether you're
              gearing up for your first job, switching careers, or just want to
              ace that next big opportunity, we've got you covered. Practice
              with us, get feedback, and walk into your interviews with
              confidence. Let's make sure you're ready to impress!
            </p>
          </div>
        </div>
        <div className="right-content2-main">
          <p>Want to Test your skills again?</p>
          <button onClick={gotoHomePage}>Take Interview</button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewPage;
