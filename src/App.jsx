import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { API_ENDPOINTS } from './config';

// Import your components
import AdminLayout from "layouts/admin"; // Assuming this is the main admin layout
import Signin from "../src/views/auth/SignIn"; // Your Signin component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check authentication and user role
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }


      const response = await fetch(API_ENDPOINTS.GETUSERDATA, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'admin') {
        setIsAuthenticated(true);
        setIsAdmin(true);
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('token');
        window.location.href = '/'; 
      }
    }
    } catch (error) {
      console.error("Authentication check failed:", error);
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    // You can add a loading spinner here if needed
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* If the user is authenticated and is an admin */}
      {isAuthenticated && isAdmin ? (
        <>
          <Route path="admin/*" element={<AdminLayout />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      ) : !isAuthenticated ? (
        <>
          <Route path="signin" element={<Signin />} />
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </>
      ) : (
        // For users who are authenticated but not admins
        <>
          <Route path="signin" element={<Navigate to="/admin" replace />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
