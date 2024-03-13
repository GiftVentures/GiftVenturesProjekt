import React, { useEffect, useState } from 'react';
import './ForgotPassword.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [allowSubmit, setAllowSubmit] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0); // Az újraküldésig hátralévő idő

  useEffect(() => {
    if (!allowSubmit) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0) {
            clearInterval(timer);
            setAllowSubmit(true);
          }
          return prevTime - 1000; 
        });
      }, 1000); 
      return () => clearInterval(timer);
    }
  }, [allowSubmit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Adj meg egy emailt');
    } else {
      if (allowSubmit) {
        setAllowSubmit(false);
        const response = await fetch('http://localhost:3500/api/user/forgotPassword', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const json = await response.json();
        setMessage(json);
        setRemainingTime(60000);
      } else {
        setMessage('Egy percenként csak egyszer küldhetsz újra.');
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <>
      <form className='forgotPasswordForm' onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          disabled={!allowSubmit}
        />
        <button type='submit' disabled={!allowSubmit}>Küldés</button>
      </form>
      <p>{message}</p>
      {!allowSubmit && <p>Újra küldhető: {formatTime(remainingTime)}</p>}
    </>
  );
};

export default ForgotPassword;
