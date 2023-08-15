const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const uuid = require('uuid');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const os = require('os');
const networks = os.networkInterfaces();
const dgram = require('dgram');
const cookieParser = require('cookie-parser'); // Add this line

app.use(cors());
app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
}))

app.get('/api/data', (req, res) => {
  const frontendIpAddress = req.ip;
  const clientSessionId = req.session.clientSessionId;

  // Check if backend session ID cookie already exists
  const backendSessionId = req.cookies.backendSessionId || uuid.v4();
  
  // Set the backend session ID as a cookie on the client's browser if it doesn't already exist
  if (!req.cookies.backendSessionId) {
    res.cookie('backendSessionId', backendSessionId, { maxAge: 86400000 }); // Cookie will expire after 24 hours
  }

  const backendIpAddress = req.socket.localAddress;

  res.json({
    clientSessionId: clientSessionId,
    frontendIp: frontendIpAddress,
    backendIp: backendIpAddress,
    backendSessionId: backendSessionId,
  });
});

app.listen(port);
