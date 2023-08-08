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
  store: new MemoryStore(),
}));

app.get('/api/data', (req, res) => {
  // If clientSessionId doesn't exist in the session, generate a new one
  if (!req.session.clientSessionId) {
    req.session.clientSessionId = uuid.v4();
  }
  
  const clientSessionId = req.session.clientSessionId;
  const backendSessionId = req.session.serverSessionId || generateBackendSessionId(req);

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

function generateBackendSessionId(req) {
  const sessionId = uuid.v4();
  req.session.serverSessionId = sessionId;
  return sessionId;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
