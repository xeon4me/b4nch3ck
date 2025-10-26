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
