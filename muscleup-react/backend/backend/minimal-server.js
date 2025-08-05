const express = require('express');

const app = express();
const PORT = 5000;

// CORS middleware (simple version)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory user storage for development
let users = [];
let userIdCounter = 1;

// Simple token generation
const generateToken = (userId) => {
  return `muscleup_token_${userId}_${Date.now()}`;
};

// Simple auth middleware
const simpleAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  const userId = token.split('_')[2];
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
    const { name, email, password } = req.body;

    console.log('🔄 Registration attempt:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password, // In production, this should be hashed
      createdAt: new Date()
    };
    users.push(user);

    console.log('✅ User created:', { id: user.id, name: user.name, email: user.email });

    // Generate token
    const token = generateToken(user.id);

    // Don't send password back
    const { password: _, ...userResponse } = user;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔄 Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find user
    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      console.log('❌ Login failed: Invalid credentials');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ Login successful:', { id: user.id, name: user.name, email: user.email });

    // Generate token
    const token = generateToken(user.id);

    // Don't send password back
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
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
    registeredUsers: users.length,
    version: '1.0.0'
  });
});

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
  console.log('❓ 404 - Route not found:', req.originalUrl);
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('💥 Server Error:', error);
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ===============================');
  console.log('   MuscleUp Backend Server');
  console.log('===============================');
  console.log(`📊 Port: ${PORT}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log(`🔧 API Base: http://localhost:${PORT}/api`);
  console.log(`💾 Storage: In-memory (development)`);
  console.log(`✅ Ready for authentication!`);
  console.log('===============================\n');
});

module.exports = app;
