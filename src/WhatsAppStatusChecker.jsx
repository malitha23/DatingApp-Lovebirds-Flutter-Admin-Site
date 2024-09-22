import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import "./WhatsAppStatusChecker.css";
import { API_ENDPOINTS } from './config';

const WhatsAppStatusChecker = () => {
  const [status, setStatus] = useState({
    connected: false,
    isAuthenticated: false,
    qr: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.sendmessagewhatsappwhatsappstatus);
      const data = await response.json();
      console.log("WhatsApp Status:", data);

      setStatus((prevStatus) => ({
        connected: data.connected,
        isAuthenticated: data.isAuthenticated,
        qr: data.qr || prevStatus.qr,
      }));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching WhatsApp status:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchStatus, 2000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (status.connected) {
      const timeoutId = setTimeout(() => {
        navigate("/"); // Navigate to the home page when connected
      }, 1000); // Wait for 2 seconds before navigating

      return () => clearTimeout(timeoutId); // Clear timeout on unmount
    }
  }, [status.connected, navigate]);

  const handleQRCodeError = () => {
    console.error("Failed to generate QR code.");
    setStatus((prevStatus) => ({ ...prevStatus, qr: null }));
  };

  return (
    <div className="body">
      <div className="container">
        {loading ? (
          <h3 className="header">Checking WhatsApp Connection Status...</h3>
        ) : (
          <div>
            {status.connected ? (
              <div>
                <h3 className="header">WhatsApp is connected!</h3>
              </div>
            ) : (
              <div>
                {status.isAuthenticated ? (
                  <div>
                    <p className="message">
                      Authenticated. please wait to connecting...
                    </p>
                    <div className="loader"></div>
                  </div>
                ) : status.qr ? (
                  <>
                    <h3 className="header">WhatsApp is not connected.</h3>
                    <p className="message">
                      Please scan the QR code below to connect:
                    </p>
                    <div className="qr-code">
                      <QRCodeCanvas
                        value={status.qr}
                        size={256}
                        onError={handleQRCodeError}
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <p className="message">
                      Authenticating your account. Please hold on...
                    </p>

                    <div className="loader"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div className="footer">© 2024 lovebird4u Inc.</div>
      </div>
    </div>
  );
};

export default WhatsAppStatusChecker;
