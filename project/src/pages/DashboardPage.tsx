import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Filter, Search, Plus, User } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import HistoryCard, { HistoryItem } from '../components/HistoryCard';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, fetch history from your API
        // const response = await fetch('/api/user/history');
        // const data = await response.json();
        
        // For demo, create mock data
        const mockHistory: HistoryItem[] = [
          {
            id: '1',
            fileName: 'Q1_Sales_Report.xlsx',
            uploadDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            chartType: 'Bar Chart',
            previewUrl: 'https://images.pexels.com/photos/7567440/pexels-photo-7567440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          },
          {
            id: '2',
            fileName: 'Customer_Feedback_Analysis.xlsx',
            uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            chartType: 'Pie Chart',
            previewUrl: 'https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          },
          {
            id: '3',
            fileName: 'Marketing_Campaign_Results.xlsx',
            uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            chartType: 'Line Chart',
            previewUrl: 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          },
          {
            id: '4',
            fileName: 'Financial_Projections_2025.xlsx',
            uploadDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
            chartType: '3D Scatter Plot',
            previewUrl: 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          }
        ];
        
        setHistoryItems(mockHistory);
      } catch (error) {
        console.error('Failed to fetch history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16 bg-emerald-50">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12">
        <div className="mb-6 md:mb-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name || user?.email || 'User'}! Manage your data visualizations.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link to="/upload">
            <Button className="flex items-center">
              <Upload size={16} className="mr-1" />
              <span>Upload File</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Total Files</p>
            <h3 className="text-3xl font-bold text-gray-900">{historyItems.length}</h3>
            <p className="text-xs text-green-600 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m18 15-6-6-6 6"/>
              </svg>
              <span>+2 this week</span>
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Charts Created</p>
            <h3 className="text-3xl font-bold text-gray-900">12</h3>
            <p className="text-xs text-green-600 flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m18 15-6-6-6 6"/>
              </svg>
              <span>+5 this week</span>
            </p>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Storage Used</p>
            <h3 className="text-3xl font-bold text-gray-900">32.4 MB</h3>
            <p className="text-xs text-gray-600">of 1 GB</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '3.24%' }}></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Plan</p>
            <h3 className="text-3xl font-bold text-gray-900">Free</h3>
            <Link to="/upgrade" className="text-xs text-blue-600 hover:text-blue-800">
              Upgrade to Pro
            </Link>
          </div>
        </Card>
      </div>
      
      {/* Recent Uploads */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Recent Uploads</h2>
          
          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 w-full md:w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-1" />
              <span>Filter</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : historyItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {historyItems.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
            
            <Link to="/upload" className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-6 h-full min-h-[240px] hover:bg-gray-50 transition-colors">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Plus size={24} className="text-blue-600" />
              </div>
              <p className="text-gray-600 text-center">Upload new Excel file</p>
            </Link>
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Upload size={24} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Upload your first Excel file to start creating beautiful visualizations.
              </p>
              <Link to="/upload">
                <Button>Upload File</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;