import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js'; // ✅ Correct named import
import { uploadExcel } from '../controllers/uploadController.js';
import ExcelFile from '../models/ExcelFile.js';

const router = express.Router();

// ✅ Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (validTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed (.xls or .xlsx)'));
    }
  },
});

// ✅ Upload Excel file
router.post('/upload', authenticate, upload.single('file'), uploadExcel);

// ✅ Get all files uploaded by the authenticated user
router.get('/files', authenticate, async (req, res) => {
  try {
    const files = await ExcelFile.find({ uploadedBy: req.user.id });
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('Fetch files error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch uploaded files' });
  }
});

// ✅ Delete a file by ID, only if uploaded by the current user
router.delete('/files/:id', authenticate, async (req, res) => {
  try {
    const deleted = await ExcelFile.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found or not authorized',
      });
    }

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during delete' });
  }
});

export default router;
