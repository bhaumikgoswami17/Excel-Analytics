import React from 'react';
import { Link } from 'react-router-dom';
import { FileSpreadsheet, Calendar, BarChart2, ExternalLink } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from './ui/Card';
import Button from './ui/Button';

export interface HistoryItem {
  id: string;
  fileName: string;
  uploadDate: string; // ISO string
  chartType: string;
  previewUrl: string;
}

interface HistoryCardProps {
  item: HistoryItem;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ item }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <FileSpreadsheet size={16} className="text-blue-600" />
            </div>
            <CardTitle className="text-base truncate max-w-xs">{item.fileName}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="mb-4 bg-gray-100 rounded-lg overflow-hidden h-40 flex items-center justify-center">
          {item.previewUrl ? (
            <img 
              src={item.previewUrl} 
              alt={`${item.chartType} preview`} 
              className="w-full h-full object-cover"
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
  );
};

export default HistoryCard;