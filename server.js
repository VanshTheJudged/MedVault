const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const path = require('path');

dotenv.config();
const app = express();

// Serve static files from public or frontend folder
app.use(express.static(path.join(__dirname, 'public'))); // or 'frontend'

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // or the main HTML file
});

const helmet = require('helmet');

// Relax CSP a bit
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"], // Allow inline scripts
      "default-src": ["'self'"]
    }
  })
);
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/report', uploadRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(5000, () => console.log('Server running on port 5000'));
}).catch((err) => console.log(err));
