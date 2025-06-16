import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Calendar,
  BarChart2,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';
import toast from 'react-hot-toast';

export interface HistoryItem {
  id: string;
  fileName: string;
  uploadDate: string; // ISO string
  chartType: string;
  previewUrl?: string;
}

interface HistoryCardProps {
  item: HistoryItem;
  onDelete?: (id: string) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/excel/files/${item.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast.success('🗑️ File deleted successfully');
        onDelete?.(item.id);
      } else {
        toast.error('❌ Failed to delete file');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('🚫 Something went wrong while deleting');
    } finally {
      setIsDeleting(false);
      setConfirmOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start space-x-2">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileSpreadsheet size={16} className="text-blue-600" />
              </div>
              <CardTitle className="text-base font-medium truncate max-w-[160px] md:max-w-[200px]">
                <span title={item.fileName}>{item.fileName}</span>
              </CardTitle>
            </div>

            <button
              onClick={() => setConfirmOpen(true)}
              disabled={isDeleting}
              className="ml-2 p-1 rounded-full transition-colors bg-transparent hover:bg-red-600"
              title="Delete file"
            >
              <Trash2 size={18} className="text-black hover:text-white" />
            </button>
          </div>
        </CardHeader>

        <CardContent className="flex-grow flex flex-col">
          <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
            {item.previewUrl ? (
              <img
                src={item.previewUrl}
                alt={`${item.chartType} preview`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <BarChart2 size={48} className="text-gray-400" />
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar size={16} className="mr-2" />
              <span>{formatDate(item.uploadDate)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <BarChart2 size={16} className="mr-2" />
              <span>{item.chartType}</span>
            </div>
          </div>

          <div className="mt-auto">
            <Link to={`/analysis/${item.id}`} className="w-full">
              <Button fullWidth className="flex items-center justify-center">
                <span>View Analysis</span>
                <ExternalLink size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Confirm Deletion</h3>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete <strong>{item.fileName}</strong>?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryCard;
