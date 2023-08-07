import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Fetch the session ID and IP address from the backend when the component mounts
    axios.get('http://192.168.0.8:5000/api/session')
      .then((response) => setSessionId(response.data.sessionId))
      .catch((error) => console.error('Error fetching session ID:', error));

    axios.get('http://192.168.0.8:5000/api/ip')
      .then((response) => setIpAddress(response.data.ip))
      .catch((error) => console.error('Error fetching IP address:', error));
  }, []);

  return (
    <div>
      <h1>My App</h1>
      <h2>Session ID: {sessionId}</h2>
      <h2>Client IP Address: {ipAddress}</h2>
    </div>
  );
};

export default App;
