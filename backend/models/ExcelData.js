import mongoose from 'mongoose';

const excelDataSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  filename: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: String,
    required: true // You may also link this to a user model if available
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ExcelData', excelDataSchema);
