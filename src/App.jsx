import React, { useEffect, useState } from "react";

import { API_ENDPOINTS } from './config';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./index.css";
// Import your components
import AdminLayout from "layouts/admin"; // Assuming this is the main admin layout
import Signin from "../src/views/auth/SignIn"; // Your Signin component
import WhatsAppStatusChecker from "./WhatsAppStatusChecker"; // Import the WhatsApp Status Checker component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(null); // State for WhatsApp connection status
  const navigate = useNavigate(); // Use navigate instead of Navigate component

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
      localStorage.removeItem('token');
      window.location.href = '/'; 
    } finally {
      setLoading(false);
    }
  };

  // Function to check WhatsApp connection status
  const checkWhatsAppConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sendmessagewhatsappwhatsappstatus);
      const data = await response.json();
      setIsConnected(data.connected); // Set connection status
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
      setIsConnected(false); // Consider not connected on error
    }
  };

  useEffect(() => {
    checkAuth(); // Check authentication on load
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Check WhatsApp connection status if authenticated
      checkWhatsAppConnection();
      
      // Set interval to poll every 5 seconds for WhatsApp status
      const intervalId = setInterval(checkWhatsAppConnection, 5000);
      
      // Clear the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && isAdmin && isConnected === false) {
        // Redirect to WhatsApp status if not connected
        navigate('/whatsapp-status', { replace: true });
      } else if (!isAuthenticated) {
        // Redirect to signin if not authenticated
        navigate('/signin', { replace: true });
      }
    }
  }, [loading, isAuthenticated, isAdmin, isConnected, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="loader"></div>
          <br></br>
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <Routes>
        {/* If the user is authenticated and is an admin */}
        {isAuthenticated && isAdmin ? (
          <>
            <Route path="admin/*" element={<AdminLayout />} />
            <Route path="/" element={<Navigate to="/admin" replace />} />
          </>
        ) : (
          <>
            {/* Redirects for non-authenticated users */}
            <Route path="signin" element={<Signin />} />
            <Route path="/" element={<Navigate to="/signin" replace />} />
          </>
        )}
        <Route path="/whatsapp-status" element={<WhatsAppStatusChecker />} /> {/* WhatsApp Status Checker Route */}
      </Routes>
    </>
  );
};

export default App;
