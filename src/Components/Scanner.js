import React, { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import './style.css';

const Scanner = () => {
  const scannerRef = useRef(null);

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
      fps: 10,
    });

    scannerRef.current = scanner;

    const handleScanSuccess = (decodedText) => {
      console.log("QR code scanned successfully:", decodedText);
      alert(`QR code scanned: ${decodedText}`);
    };

    const handleScanError = (err) => {
      console.error("QR code scanning error:", err);
    };

    scanner.render(handleScanSuccess, handleScanError);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error("Failed to clear scanner", error);
        });
      }
    };
  }, []);

  return (
    <div className='centered-container'>
      <h1 className='container-title'>Scan QR Code</h1>
      <div id="reader" style={{ width: '500px', height: '250px' }}></div>
    </div>
  );
};

export default Scanner;
