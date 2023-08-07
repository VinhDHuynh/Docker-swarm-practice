import React, { useEffect, useState } from 'react';

const App = () => {
  const [sessionId, setSessionId] = useState('');
  const [ipAddress, setIpAddress] = useState('');

  useEffect(() => {
    // Fetch the session ID and IP address from the backend when the component mounts
    fetch('http://back-end/api/session')
      .then((response) => response.json())
      .then((data) => setSessionId(data.sessionId))
      .catch((error) => console.error('Error fetching session ID:', error));

    fetch('http://back-end/api/ip')
      .then((response) => response.json())
      .then((data) => setIpAddress(data.ip))
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
