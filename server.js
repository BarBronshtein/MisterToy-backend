const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const MAP_KEY =
  process.env === 'production'
    ? process.env.MAP_KEY
    : 'AIzaSyAl-v0FWCCcT0o6UrjDE17w4NIVtAa9AAI';

const app = express();
const http = require('http').createServer(app);

// Express App Config
app.use(cookieParser());
app.use(express.json());
// app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
  // Express serve static files on production environment
  app.use(express.static(path.resolve(__dirname, 'public')));
} else {
  // Configuring CORS
  const corsOptions = {
    // Make sure origin contains the url your frontend is running on
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    credentials: true,
  };
  app.use(cors(corsOptions));
}

const authRoutes = require('./api/auth/auth-routes');
const userRoutes = require('./api/user/user-route');
const toyRoutes = require('./api/toy/toy-routes');
const { setupSocketAPI } = require('./services/socket.services');

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware');
app.all('*', setupAsyncLocalStorage);

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/toy', toyRoutes);

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/toy/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const logger = require('./services/logger-service');
const port = process.env.PORT || 3030;
http.listen(port, () => {
  logger.info('Server is running on port: ' + port);
});
