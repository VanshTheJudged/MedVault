const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');
const path = require('path');
const helmet = require('helmet');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes FIRST
app.use('/api/auth', authRoutes);
app.use('/api/report', uploadRoutes);

// ✅ Serve all frontend HTML/CSS/JS from "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Define routes to serve specific HTML files (if needed)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Mongo connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  })
  .catch(err => console.log(err));
