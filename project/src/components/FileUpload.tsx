import React, { useState, useRef } from 'react';
import { Upload, File, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Update path if different


interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    filename: string;
    fileSize: number;
    totalRows: number;
    savedCount: number;
    sheetName: string;
  };
  error?: string;
}

const FileUploadSimple: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    const allowedTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel.sheet.macroEnabled.12',
    ];
    const extension = file.name.toLowerCase().split('.').pop();
    if (!allowedTypes.includes(file.type) && !(extension === 'xls' || extension === 'xlsx')) {
      setError('Please select a valid Excel file (.xls or .xlsx)');
      return false;
    }
    if (file.size === 0) {
      setError('File is empty');
      return false;
    }
    setError(null);
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
        setResponse(null);
        setError(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && validateFile(file)) {
      setSelectedFile(file);
      setResponse(null);
      setError(null);
    } else {
      setSelectedFile(null);
    }
  };

const { user } = useAuth();
const userName = user?.name ?? 'Unknown';

const handleUpload = async () => {
  if (!selectedFile) {
    setError('Please select a file first');
    return;
  }

  setUploading(true);
  setError(null);
  setResponse(null);

  const formData = new FormData();
  formData.append('file', selectedFile);
  formData.append('uploadedBy', userName); // ✅ Add this line

  try {
    const res = await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Upload failed');
    setResponse(data);
  } catch (err: any) {
    setError(err.message || 'Upload error');
  } finally {
    setUploading(false);
  }
};

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setError(null);
    setResponse(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getStatusColor = () => {
    if (response?.success) return 'border-green-300 bg-green-50';
    if (error) return 'border-red-300 bg-red-50';
    if (uploading) return 'border-blue-300 bg-blue-50';
    return dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50';
  };

  const getIconColor = () => {
    if (response?.success) return 'text-green-600 bg-green-100';
    if (error) return 'text-red-600 bg-red-100';
    if (uploading) return 'text-blue-600 bg-blue-100';
    return 'text-blue-600 bg-blue-100';
  };

  const renderIcon = () => {
    if (response?.success) return <CheckCircle className="h-8 w-8" />;
    if (error) return <AlertCircle className="h-8 w-8" />;
    if (selectedFile) return <File className="h-8 w-8" />;
    return <Upload className="h-8 w-8" />;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 
          ${getStatusColor()}
          ${uploading ? 'opacity-70 pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="space-y-4">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${getIconColor()}`}>
            {renderIcon()}
          </div>
          
          {response?.success ? (
            <div className="space-y-3">
              <div className="text-green-700">
                <h3 className="text-lg font-medium">Upload Successful!</h3>
                <p className="text-sm mt-1">{response.message}</p>
              </div>
              {response.data && (
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>File:</strong> {response.data.filename}</p>
                  <p><strong>Size:</strong> {(response.data.fileSize / (1024 * 1024)).toFixed(2)} MB</p>
                  <p><strong>Rows processed:</strong> {response.data.totalRows}</p>
                  <p><strong>Records saved:</strong> {response.data.savedCount}</p>
                </div>
              )}
              <button 
                onClick={resetUpload}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload Another File
              </button>
            </div>
          ) : selectedFile ? (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-sm text-gray-500">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {uploading ? (
                <p className="text-sm text-blue-600">Uploading...</p>
              ) : (
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                  <button 
                    onClick={handleButtonClick} 
                    disabled={uploading}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Change File
                  </button>
                  <button 
                    onClick={resetUpload}
                    className="p-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop your Excel file here
              </p>
              <p className="text-sm text-gray-500">
                Supports .xls and .xlsx files up to 10MB
              </p>
              <button 
                onClick={handleButtonClick}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <div className="flex items-start text-red-700 text-sm">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-sm font-medium text-gray-700">
                Uploading and processing...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadSimple;