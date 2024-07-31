import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './style.css';

const QRScanner = () => {
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [rollnumber, setRollnumber] = useState(null);
  const [location, setLocation] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const scannerRef = useRef(null);

  useEffect(() => {
    const storedRollnumber = localStorage.getItem('rollnumber');
    setRollnumber(storedRollnumber);

    if (!storedRollnumber) {
      setError("No Rollnumber found. Please Register first");
    }
  }, []);

  useEffect(() => {
    if (rollnumber) {
      fetchLocation();
    }
  }, [rollnumber]);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError('Error fetching location.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch((error) => {
        console.error("Failed to clear scanner", error);
      });
    }

    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    scannerRef.current = scanner;

    const handleScanSuccess = async (decodedText) => {
      try {
        const uniqueId = decodedText.trim();
        
        if (!uniqueId) {
          throw new Error("Invalid QR code format: No data provided.");
        }

        const URL = process.env.REACT_APP_API_BASE_URL;
        console.log("API Base URL:", URL); 

        if (!URL) {
          throw new Error("API base URL is not defined.");
        }

        const apiUrl = `${URL}/QRscanner/${uniqueId}`;
        console.log("API URL:", apiUrl);

        const response = await axios.get(apiUrl, {
          params: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
          headers: {
            'stored-rollnumber': rollnumber,
          },
        });

        if (response.status === 200) {
          const { message, subject_code, subject_name, roll_number, name, email, mobile_number } = response.data;
          
          setMessage(`Your attendance is marked successfully for the subject: ${subject_name} (${subject_code})`);
          setUserDetails({ roll_number, name, email, mobile_number });
        } else {
          setError("Failed to fetch subject details. Please try again.");
        }
      } catch (error) {
        console.error("Error during QR code handling:", error);
        setError("An error occurred while processing the QR code. Please try again.");
      }
    };

    const handleScanError = (err) => {
      console.error("QR code scanning error:", err);
      setError("An error occurred during scanning. Please try again.");
      setUserDetails(null);
      setMessage(null);
    };

    scanner.render(handleScanSuccess, handleScanError);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, [rollnumber, location]);

  return (
    <div className='centered-container'>
      <h1 className='container-title'>Scan QR Code</h1>
      <div>Registered Roll number: {rollnumber}</div>
      <div>Location: {location ? `${location.latitude}, ${location.longitude}` : 'Retrieving location...'}</div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {message && (
        <div style={{ color: 'green' }}>
          {message}
          {userDetails && (
            <div>
              <div>Roll Number: {userDetails.roll_number}</div>
              <div>Name: {userDetails.name}</div>
              <div>Email: {userDetails.email}</div>
              <div>Mobile Number: {userDetails.mobile_number}</div>
            </div>
          )}
        </div>
      )}
      {!userDetails && !error && !message && (
        <div id="reader" style={{ width: '500px' }}></div>
      )}
    </div>
  );
};

export default QRScanner;
