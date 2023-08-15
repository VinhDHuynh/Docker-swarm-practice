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
const cookieParser = require('cookie-parser');
const redis = require('redis');

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




// Function to generate a simple 3-letter random string
function generateRandomString() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomString = '';
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
}

// Create a Redis client instance
const client = redis.createClient({
  url: 'redis://redis:6379',
  port: 6379,    // Redis port
});

client.connect();
// Handle connection events
client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
  console.error('Redis Error:', err);
});

// Local map to store backendSessionId to random value mapping
const backendSessionIdMap = new Map();

app.get('/api/data', (req, res) => {
  
  const frontendIpAddress = req.ip;
  const clientSessionId = req.session.clientSessionId;

  // Check if backend session ID cookie already exists
  let backendSessionIdCookie = req.cookies.backendSessionId;

  // Check if backend session ID cookie already exists
  const backendSessionId = backendSessionIdCookie || uuid.v4();

  // If backendSessionId exists in the cookie but not in the local map, retrieve it from Redis
  if (backendSessionIdCookie && !backendSessionIdMap.has(backendSessionIdCookie)) {
    client.get(backendSessionIdCookie, (err, value) => {
      if (!err && value) {
        backendSessionIdMap.set(backendSessionIdCookie, value);
      }
    });
  }

  if (!backendSessionIdCookie) {
    //setting this to retrieve map value
    backendSessionIdCookie = backendSessionId;

    // Generate a random 3-letter string for the value
    const randomValue = generateRandomString();
    backendSessionIdMap.set(backendSessionId, randomValue);
    // Store backendSessionId in Redis with the random value
    client.set(backendSessionId, randomValue, (err) => {
      if (!err) {
        backendSessionIdMap.set(backendSessionId, randomValue);
      }
    });

    // Set the backendSessionId as a cookie on the client's browser
    res.cookie('backendSessionId', backendSessionId);
  }
  // If backendSessionId exists in the cookie but not in the local map, retrieve it from Redis
  if (backendSessionIdCookie && !backendSessionIdMap.has(backendSessionIdCookie)) {
    client.get(backendSessionIdCookie, (err, value) => {
      if (!err && value) {
        backendSessionIdMap.set(backendSessionIdCookie, value);
      }
    });
  }
  const backendIpAddress = req.socket.localAddress;

  const redisValue = backendSessionIdMap.get(backendSessionIdCookie);
  console.log(redisValue);

  res.json({
    clientSessionId: clientSessionId,
    frontendIp: frontendIpAddress,
    backendIp: backendIpAddress,
    backendSessionId: backendSessionId, 
    redisValue: redisValue,
  });
});


app.listen(port);
