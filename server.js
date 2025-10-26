const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ CHANGE THIS SECRET KEY! Must match frontend
const API_SECRET = process.env.API_SECRET || 'AntiJudas696-Secret-Change-This-Key-2025';

// Rate limiting storage
const rateLimitMap = new Map();
const MAX_REQUESTS_PER_MINUTE = 10;

// CORS Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());
app.use(express.static('public'));

// ===== MIDDLEWARE =====

// IP Rate Limiting
function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress;
  
  const now = Date.now();
  const windowMs = 60000; // 1 minute

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const requests = rateLimitMap.get(ip).filter(time => now - time < windowMs);
  
  if (requests.length >= MAX_REQUESTS_PER_MINUTE) {
    console.log(`⚠️  Rate limit exceeded for IP: ${ip}`);
    return res.status(429).json({
      error: true,
      message: 'Too many requests. Please wait a minute and try again.'
    });
  }

  requests.push(now);
  rateLimitMap.set(ip, requests);
  
  // Cleanup old entries periodically
  if (rateLimitMap.size > 1000) {
    const oldEntries = Array.from(rateLimitMap.entries())
      .filter(([_, times]) => times.every(t => now - t > windowMs))
      .map(([ip]) => ip);
    oldEntries.forEach(ip => rateLimitMap.delete(ip));
  }
  
  next();
}

// Token Validation
function validateToken(req, res, next) {
  const token = req.headers['x-api-token'] || req.query.token;
  const timestamp = req.headers['x-timestamp'] || req.query.timestamp;
  const numero = req.query.numero;
  
  if (!token || !timestamp || !numero) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: Missing authentication'
    });
  }

  // Validate timestamp (must be within 5 minutes)
  const now = Date.now();
  const requestTime = parseInt(timestamp);
  
  if (isNaN(requestTime) || Math.abs(now - requestTime) > 300000) {
    return res.status(401).json({
      error: true,
      message: 'Token expired. Please refresh and try again.'
    });
  }

  // Generate expected token
  const expectedToken = crypto
    .createHmac('sha256', API_SECRET)
    .update(timestamp + numero)
    .digest('hex');

  // Compare tokens
  if (token !== expectedToken) {
    console.log(`⚠️  Invalid token attempt for number: ${numero}`);
    return res.status(401).json({
      error: true,
      message: 'Invalid authentication token'
    });
  }

  next();
}

// ===== ROUTES =====

// Root route - serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Protected API endpoint
app.get('/checkban', rateLimiter, validateToken, async (req, res) => {
  try {
    const { numero } = req.query;

    // Validate phone number
    if (!numero || numero.length < 8) {
      return res.status(400).json({
        error: true,
        message: 'Invalid phone number format'
      });
    }

    // Clean the number
    const cleanNumber = numero.replace(/[^0-9]/g, '');

    console.log(`🔍 Checking ban status for: ${cleanNumber}`);

    // Call external API
    const response = await axios.get(
      `https://consultas.cc/apis/whatsapp/checkban.php?numero=${cleanNumber}`,
      {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    console.log(`✅ Ban check completed for: ${cleanNumber} - Banned: ${response.data.banido}`);

    // Return the response
    res.json(response.data);

  } catch (error) {
    console.error('❌ Error checking ban status:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: true,
        message: 'Request timeout. The service is taking too long to respond.'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        error: true,
        message: 'External API error. Please try again later.'
      });
    }

    res.status(500).json({
      error: true,
      message: 'Failed to check ban status. Please try again.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    service: 'AntiJudas Ban Checker',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'AntiJudas Ban Checker API',
    version: '1.0.0',
    author: 'Brutozin',
    endpoints: {
      check: '/checkban?numero=PHONE_NUMBER',
      health: '/health'
    },
    note: 'Authentication required for all endpoints'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: true,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   🕯️  AntiJudas Ban Checker API 🕯️    ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Local: http://localhost:${PORT}`);
  console.log(`🔐 API Secret: ${API_SECRET.substring(0, 10)}...`);
  console.log(`⏱️  Started at: ${new Date().toISOString()}`);
  console.log('════════════════════════════════════════');
});
