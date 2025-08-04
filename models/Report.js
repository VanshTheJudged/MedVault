const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  filename: String,
  fileType: String,
  fileData: Buffer,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
