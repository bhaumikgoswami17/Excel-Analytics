import express from 'express';
import multer from 'multer';
import auth from '../middleware/auth.js';
import { uploadExcel } from '../controllers/uploadController.js';
import ExcelFile from '../models/ExcelFile.js';

const router = express.Router();

// Configure multer for memory storage
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

// Upload route
router.post('/upload', auth, upload.single('file'), uploadExcel);

// 🔹 GET all Excel files uploaded by current user
router.get('/files', auth, async (req, res) => {
  try {
    console.log('🔍 req.user:', req.user);

    const files = await ExcelFile.find({ uploadedBy: req.user.id });

    console.log('✅ Found files:', files.length);
    res.status(200).json({ success: true, files });
  } catch (error) {
    console.error('❌ Fetch files error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch uploaded files' });
  }
});

// 🔸 DELETE a specific file
router.delete('/files/:id', auth, async (req, res) => {
  try {
    const deleted = await ExcelFile.findOneAndDelete({
      _id: req.params.id,
      uploadedBy: req.user.id // ✅ match by MongoDB user ID now
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found or you are not authorized to delete it',
      });
    }

    res.status(200).json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Internal server error during delete' });
  }
});

export default router;
