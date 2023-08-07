const express = require('express');
const cors = require('cors'); // Import the cors package
const app = express();
const port = 5000;
const uuid = require('uuid');

// Use the cors middleware for all routes
app.use(cors());

app.get('/api/session', (req, res) => {
  // Generate a new session ID using UUID
  const sessionId = uuid.v4();
  // Store the session ID in a cookie on the client's browser
  res.cookie('sessionID', sessionId, { httpOnly: true });
  // Send the session ID back to the client
  res.json({ sessionId });
});

app.get('/api/ip', (req, res) => {
  const clientIpAddress = req.ip || req.connection.remoteAddress;
  res.json({ ip: clientIpAddress });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
