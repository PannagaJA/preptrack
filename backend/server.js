const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes correctly
const authRoutes = require('./routes/auth');
const aptitudeRoutes = require('./routes/aptitude');
const roadmapRoutes = require('./routes/roadmap');
const leaderboardRoutes = require('./routes/leaderboard');
const statsRoutes = require('./routes/stats');

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store io instance for use in routes
app.set('io', io);

// Middleware
app.use(express.json());

// Routes - Make sure these are middleware functions
app.use('/api/auth', authRoutes);
app.use('/api/aptitude', aptitudeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'PrepTrack Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: 'Something went wrong!' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 PrepTrack Server running on port ${PORT}`);
  console.log(`📊 SQLite Database initialized`);
  console.log(`🔗 API available at http://localhost:${PORT}/api`);
  
  // Handle socket connections
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
});