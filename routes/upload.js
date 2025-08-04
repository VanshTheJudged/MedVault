const express = require('express');
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const Report = require('../models/Report');
const router = express.Router();
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const isJPG = file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg';
    isJPG ? cb(null, true) : cb(new Error('Only JPG images allowed'));
  }
});

// Upload a JPG report
router.post('/upload', auth, upload.single('report'), async (req, res) => {
  try {
    const newReport = new Report({
      user: req.user,
      filename: req.file.originalname,
      fileType: req.file.mimetype,
      fileData: req.file.buffer
    }); 

    await newReport.save();
    res.json({ msg: 'Report uploaded successfully', fileId: newReport._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Upload failed' });
  }
});


router.get('/download', auth, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user });

    if (!reports.length) {
      return res.status(404).json({ msg: 'No reports found' });
    }

    // Create PDF
    const doc = new PDFDocument();
    let chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="all_reports.pdf"',
      });
      res.send(pdfBuffer);
    });

    // Add each image as a new page
    for (let i = 0; i < reports.length; i++) {
      const { fileData, fileType, filename } = reports[i];
      if (i !== 0) doc.addPage();
      doc.image(fileData, {
        fit: [500, 700],
        align: 'center',
        valign: 'center',
      });
      doc.text(filename, { align: 'center' });
    }

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to generate PDF' });
  }
});

// Route to generate QR code for the download link
router.get('/qr/:id', auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report || report.user.toString() !== req.user.toString()) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    const url = `http://localhost:5000/api/report/download-single/${report._id}`;
    const qr = await QRCode.toDataURL(url);
    const img = Buffer.from(qr.split(',')[1], 'base64');

    res.set('Content-Type', 'image/png');
    res.send(img);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to generate QR code' });
  }
});



module.exports = router;
