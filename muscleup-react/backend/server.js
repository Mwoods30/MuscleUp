const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:3002',
      'http://localhost:3004',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3002',
      'http://127.0.0.1:3004',
      'https://mwoods30.github.io'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(null, true); // Allow all origins in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import route modules
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const workoutRoutes = require('./routes/workouts');
const mealRoutes = require('./routes/meals');
const oauthRoutes = require('./routes/oauth');

// Simple in-memory user storage for development (replace with MongoDB later)
let users = [];
let userIdCounter = 1;

// Make users globally accessible for routes
global.muscleUpUsers = users;

// Simple JWT-like token generation
const generateToken = (userId) => {
  return `token_${userId}_${Date.now()}`;
};

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  const userId = token.split('_')[1];
  const user = users.find(u => u.id == userId);
  if (!user) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
  
  req.user = user;
  next();
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', { email: req.body.email, name: req.body.name });
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide name, email, and password' 
      });
    }

    if (password.length < 6) {
      console.log('Registration failed: Password too short');
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Registration failed: Invalid email format');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide a valid email address' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      console.log('Registration failed: User already exists');
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password, // In production, this should be hashed
      createdAt: new Date()
    };
    users.push(user);

    // Generate token
    const token = generateToken(user.id);

    // Don't send password back
    const { password: _, ...userResponse } = user;

    console.log('Registration successful:', { userId: user.id, email: user.email });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration. Please try again.' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', { email: req.body.email });
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Login failed: Missing credentials');
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }

    // Find user (case insensitive email)
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user || user.password !== password) {
      console.log('Login failed: Invalid credentials');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Don't send password back
    const { password: _, ...userResponse } = user;

    console.log('Login successful:', { userId: user.id, email: user.email });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login. Please try again.' 
    });
  }
});

app.get('/api/auth/me', simpleAuth, (req, res) => {
  const { password: _, ...userResponse } = req.user;
  res.json({
    success: true,
    user: userResponse
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'MuscleUp Backend is running!',
    timestamp: new Date().toISOString(),
    users: users.length
  });
});

// Use route modules
app.use('/api/users', simpleAuth, userRoutes);
app.use('/api/workouts', simpleAuth, workoutRoutes);
app.use('/api/meals', simpleAuth, mealRoutes);
app.use('/api/oauth', oauthRoutes);

// OAuth placeholder
app.post('/api/oauth/auth', (req, res) => {
  const { provider } = req.body;
  res.json({
    success: false,
    message: `${provider} OAuth integration coming soon!`
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MuscleUp Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`💾 Using in-memory storage (development mode)`);
});

module.exports = app;
