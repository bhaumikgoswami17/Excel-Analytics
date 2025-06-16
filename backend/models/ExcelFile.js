import mongoose from 'mongoose';


const excelFileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true,
  },

  uploadDate: {
    type: Date,
    default: Date.now,
  },
  sheetName: String,
  totalRows: Number,
  savedCount: Number,
  fileData: {
    type: Object,
    required: true,
  },
});

const ExcelFile = mongoose.model('ExcelFile', excelFileSchema);
export default ExcelFile;
