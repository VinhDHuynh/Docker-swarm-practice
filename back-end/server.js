const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const uuid = require('uuid');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const os = require('os');
const networks = os.networkInterfaces();

app.use(cors());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
}))


// This will be the unique backend session ID for all users
const backendSessionId = uuid.v4();

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  }),
}));

app.get('/api/data', (req, res) => {
  // If clientSessionId doesn't exist in the session, generate a new one
  if (!req.session.clientSessionId) {
    req.session.clientSessionId = uuid.v4();
  }

  

  const forwardedForHeader = req.headers['x-forwarded-for'];

  const forwardedIpAddresses = forwardedForHeader ? forwardedForHeader.split(',') : [];

  

  const backendHostIpAddress = 'host.docker.internal';
  console.log('Docker Host IP:', backendHostIpAddress);

  const frontendIpAddress = req.ip;

  const clientSessionId = req.session.clientSessionId;

  const clientIpAddress = req.socket.remoteAddress;

  const backendIpAddress = req.socket.localAddress;

  res.json({
    forwardedIpAddresses: forwardedIpAddresses,
    clientSessionId: clientSessionId,
    clientIp: clientIpAddress,
    frontendIp: frontendIpAddress,
    backendIp: backendIpAddress,
    backendSessionId: backendSessionId,
    hostendHostIpAddress: backendHostIpAddress,
  });
});

app.listen(port);
