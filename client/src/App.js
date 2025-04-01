import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import InterviewPage from "./pages/InterviewPage";
import ReviewPage from "./pages/ReviewPageNew";
import LoginPage from "./pages/LoginPage";
import { GlobalProvider } from "./components/utils/GlobalState";
import "bootstrap/dist/css/bootstrap.min.css";
import InterviewList from "./pages/admin/InterviewList";
import InterviewDetail from "./pages/admin/InterviewDetail";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <ReviewPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/interviews"
            element={
              <AdminRoute>
                <InterviewList />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/interviews/:id"
            element={
              <AdminRoute>
                <InterviewDetail />
              </AdminRoute>
            }
          />
        </Routes>
      </GlobalProvider>
    </Router>
  );
}

export default App;
