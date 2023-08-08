const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const uuid = require('uuid');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

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

  const clientSessionId = req.session.clientSessionId;

  const clientIpAddress = req.socket.remoteAddress;
  const frontendIpAddress = req.socket.localAddress;
  const backendIpAddress = req.socket.localAddress;

  res.json({
    clientSessionId: clientSessionId,
    clientIp: clientIpAddress,
    frontendIp: frontendIpAddress,
    backendIp: backendIpAddress,
    backendSessionId: backendSessionId,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
