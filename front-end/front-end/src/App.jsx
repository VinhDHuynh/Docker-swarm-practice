import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const App = () => {
  const [forwardedIpAddresses, setForwardedIpAddresses] = useState([]);
  const [clientSessionId, setClientSessionId] = useState('');
  const [clientIp, setClientIp] = useState('');
  const [frontendIp, setFrontendIp] = useState('');
  const [backendIp, setBackendIp] = useState('');
  const [backendSessionId, setBackendSessionId] = useState('');
  const [backendHostIp, setBackendHostIp] = useState(''); // 1. Add the new state variable

  useEffect(() => {
    const storedClientSessionId = sessionStorage.getItem('clientSessionId');
  
    axios.get('http://192.168.0.10:5000/api/data', {
      data: { clientSessionId: storedClientSessionId }, // Include clientSessionId in the request payload
      headers: {
        'X-Forwarded-For': "192.168.0.6", // Include the frontend IP address in the X-Forwarded-For header
      },
    })
      .then((response) => {
        const data = response.data;
        setForwardedIpAddresses(data.forwardedIpAddresses);  // Set forwarded IP addresses
        setClientIp(data.clientIp);
        setFrontendIp(data.frontendIp);
        setBackendIp(data.backendIp);
        setBackendSessionId(data.backendSessionId);
        setClientSessionId(storedClientSessionId || data.clientSessionId);
        setBackendHostIp(data.backendHostIp); 

  
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
          <strong>Client IP Address:</strong> {clientIp}
        </div>
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
          <div>
          <strong>Backend Host IP:</strong> {backendHostIp}
        </div>
        </div>
        <div>
          <strong>Backend Session ID:</strong> {backendSessionId}
        </div>
      </div>
      
      <div className="box">
        <h2>Forwarded IP Addresses</h2>
        {forwardedIpAddresses.map((address, index) => (
          <div key={index}>{address}</div>
        ))}
      </div>
    </div>
  );
};

export default App;