import ExcelFile from '../models/ExcelFile.js';
import XLSX from 'xlsx';

export const uploadExcel = async (req, res) => {
  try {
    // 👇 Step 1: Add this line to debug
    console.log('Decoded User in Request:', req.user);

    const { originalname, buffer } = req.file;

    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const newFile = new ExcelFile({
      fileName: originalname,
      uploadedBy: req.user.id, // ✅ using req.user.username here
      sheetName,
      totalRows: data.length,
      savedCount: data.length,
      fileData: data,
    });

    await newFile.save();

    res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        filename: newFile.fileName,
        fileSize: req.file.size,
        totalRows: newFile.totalRows,
        savedCount: newFile.savedCount,
        sheetName: newFile.sheetName,
      },
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};
