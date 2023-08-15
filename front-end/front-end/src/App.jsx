import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const App = () => {
  const [clientSessionId, setClientSessionId] = useState('');
  const [frontendIp, setFrontendIp] = useState('');
  const [backendIp, setBackendIp] = useState('');
  const [backendSessionId, setBackendSessionId] = useState('');


  const storedClientSessionId = sessionStorage.getItem('clientSessionId');

  useEffect( () => {
  axios.get('http://192.168.0.8:5000/api/data', {
    headers: {
      'x-forwarded-for': '192.168.0.7', 
    },
    data: { clientSessionId: storedClientSessionId },
  })
    .then((response) => {
      const data = response.data;

      setFrontendIp(data.frontendIp);
      setBackendIp(data.backendIp);
      setBackendSessionId(data.backendSessionId);
      setClientSessionId(storedClientSessionId || data.clientSessionId);

      if (!storedClientSessionId) {
        sessionStorage.setItem('clientSessionId', data.clientSessionId);
      }
    })
    .catch((error) => console.error('Error fetching data:', error));
  }, []);
  

  return (
    <div className="container">
      <h1>Docker Swarm Info</h1>
      <div className="box">
        <h2>Client Info</h2>
        <div>
          <strong>Client Session ID:</strong> {clientSessionId}
        </div>
      </div>

      <div className="box">
        <h2>Frontend IP Address</h2>
        {frontendIp}
      </div>
      
      <div className="box">
        <h2>Backend Info</h2>
        <div>
          <strong>Backend IP Address:</strong> {backendIp}
        </div>
        <div>
          <strong>Backend Session ID:</strong> {backendSessionId}
        </div>
      </div>
    </div>
  );
};

export default App;