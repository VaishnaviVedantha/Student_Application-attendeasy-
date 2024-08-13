import React, { useState, useEffect } from 'react';
import './index.css';
import Register from './Components/Register';
import QRScanner from './Components/QRScanner';

function App() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [rollnumber, setRollnumber] = useState('');

  useEffect(() => {
    // Check local storage for roll number on component mount
    const savedRollnumber = localStorage.getItem('rollnumber');
    if (savedRollnumber) {
      setRollnumber(savedRollnumber);
      setIsRegistered(true);
    }
  }, []);

  const handleRegistration = (rollnumber) => {
    setRollnumber(rollnumber);
    setIsRegistered(true);
    localStorage.setItem('rollnumber', rollnumber);
  };

  return (
    <div className='App'>
      {!isRegistered ? (
        <Register onRegister={handleRegistration} />
      ) : (
        <QRScanner rollnumber={rollnumber} />
      )}
    </div>
  );
}

export default App;


/*import Scanner from './Components/Scanner';
import './index.css';

function App() {
  return (
    <Scanner />
  );
}

export default App;*/

