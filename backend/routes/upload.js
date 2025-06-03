import express from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import ExcelData from '../models/ExcelData.js';

const router = express.Router();

// Multer memory storage config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12'
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel files are allowed.'), false);
    }
  }
});

// POST /upload - Excel file upload handler
router.post('/upload', (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'File size exceeds 10MB limit' });
        }
        return res.status(400).json({ success: false, error: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!req.file || !req.file.buffer || req.file.buffer.length === 0) {
        return res.status(400).json({ success: false, error: 'No valid file uploaded' });
      }

      const uploadedBy = req.body.uploadedBy || 'Unknown'; // You can replace this with req.user.name if using auth
      const filename = req.file.originalname;
      const uploadedAt = new Date();

      console.log(`[${uploadedAt.toISOString()}] Processing file: ${filename}, Size: ${req.file.size} bytes`);

      let workbook;
      try {
        workbook = XLSX.read(req.file.buffer, {
          type: 'buffer',
          cellText: false,
          cellDates: true
        });
      } catch (parseError) {
        console.error('Excel parse error:', parseError);
        return res.status(400).json({ success: false, error: 'Invalid Excel file format' });
      }

      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        return res.status(400).json({ success: false, error: 'Excel file contains no sheets' });
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      let data;
      try {
        data = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: '',
          blankrows: false
        });
      } catch (jsonError) {
        console.error('JSON conversion error:', jsonError);
        return res.status(400).json({ success: false, error: 'Failed to convert Excel data to JSON' });
      }

      if (!data || data.length <= 1) {
        return res.status(400).json({ success: false, error: 'Excel file contains no data' });
      }

      const headers = data[0];
      const rows = data.slice(1);

      const formattedData = rows.map(row => {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || '';
        });

        return {
          data: rowData,
          filename,
          uploadedBy,
          uploadedAt
        };
      }).filter(row => Object.values(row.data).some(val => val !== ''));

      console.log(`[${uploadedAt.toISOString()}] Parsed ${formattedData.length} rows`);

      let savedData;
      try {
        savedData = await ExcelData.insertMany(formattedData, {
          ordered: false,
          lean: true
        });
      } catch (dbError) {
        console.error('Database save error:', dbError);
        return res.status(500).json({
          success: false,
          error: 'Failed to save data to database',
          details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        });
      }

      res.status(200).json({
        success: true,
        message: 'File uploaded and processed successfully',
        data: {
          filename,
          uploadedBy,
          uploadedAt,
          fileSize: req.file.size,
          totalRows: formattedData.length,
          savedCount: savedData.length,
          sheetName,
          sampleData: savedData.slice(0, 3)
        }
      });

    } catch (error) {
      console.error('Unexpected error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
});

export default router;
