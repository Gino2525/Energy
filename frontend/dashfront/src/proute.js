import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Check for stored token

  if (!token) {
    return <Navigate to="/" replace />; // Redirect to login page if no token
  }

  return children; // If authenticated, render the protected page
};

export default ProtectedRoute;
