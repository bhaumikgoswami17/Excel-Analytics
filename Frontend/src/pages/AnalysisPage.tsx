import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileSpreadsheet, Download, Share2, ArrowLeft, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import DataTable from '../components/DataTable';
import ChartTypeSelector, { ChartType } from '../components/ChartTypeSelector';
import AxisSelector from '../components/AxisSelector';
import Chart from '../components/Chart';
import { Link } from 'react-router-dom';

interface Column {
  key: string;
  name: string;
}

// Mock data for demonstration
const generateMockData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return months.map(month => {
    const sales = Math.floor(Math.random() * 5000) + 1000;
    const profit = Math.floor(sales * (0.1 + Math.random() * 0.3));
    const units = Math.floor(sales / (50 + Math.random() * 30));
    
    return {
      month,
      sales,
      profit,
      units,
      region: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
    };
  });
};

const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string | null>(null);
  const [zAxis, setZAxis] = useState<string | null>(null);
  const [fileName, setFileName] = useState('Sales Data.xlsx');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch data from your API here based on the id
        // const response = await fetch(`/api/files/${id}`);
        // const result = await response.json();
        
        // For now, use mock data
        const mockData = generateMockData();
        setData(mockData);
        
        // Extract columns from the first data item
        if (mockData.length > 0) {
          const firstItem = mockData[0];
          const cols = Object.keys(firstItem).map(key => ({
            key,
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
          }));
          
          setColumns(cols);
          setXAxis(cols[0].key);
          setYAxis(cols[1].key);
          
          if (cols.length > 2) {
            setZAxis(cols[2].key);
          }
        }
        
        setFileName(id === 'new' ? 'Sales Data.xlsx' : `Analysis_${id}.xlsx`);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Handle error state here
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  const handleDownload = () => {
    // In a real app, this would generate and download the chart
    alert('Chart download functionality would be implemented here');
  };
  
  const handleShare = () => {
    // In a real app, this would open a share dialog
    alert('Share functionality would be implemented here');
  };

  // Extract column names for dropdown options
  const columnOptions = columns.map(col => col.key);

  // Check if it's a 3D chart type
  const is3D = chartType === '3dBar' || chartType === '3dScatter';

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <FileSpreadsheet className="h-5 w-5 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">{fileName}</h1>
            </div>
            <p className="text-gray-600">
              {data.length} rows • {columns.length} columns • Uploaded just now
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="flex items-center"
            >
              <Share2 size={16} className="mr-1" />
              <span>Share</span>
            </Button>
            <Button 
              size="sm" 
              onClick={handleDownload}
              className="flex items-center"
            >
              <Download size={16} className="mr-1" />
              <span>Download Chart</span>
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Chart Visualization</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Chart 
                    data={data}
                    xAxis={xAxis}
                    yAxis={yAxis || ''}
                    zAxis={zAxis || undefined}
                    type={chartType}
                    title={`${yAxis} by ${xAxis}`}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader className="pb-0">
                  <CardTitle>Chart Configuration</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <ChartTypeSelector 
                      selectedType={chartType}
                      onChange={setChartType}
                    />
                    
                    <AxisSelector 
                      columns={columnOptions}
                      selectedX={xAxis}
                      selectedY={yAxis}
                      selectedZ={zAxis}
                      onChangeX={setXAxis}
                      onChangeY={setYAxis}
                      onChangeZ={setZAxis}
                      is3D={is3D}
                    />
                    
                    <div className="bg-blue-50 rounded-md p-4 border border-blue-100 text-sm text-blue-700 flex">
                      <Info size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">AI Suggestion</p>
                        <p className="mt-1">Based on your data, a {is3D ? '3D Bar' : 'Bar'} chart would be the best visualization to show the relationship between {xAxis} and {yAxis}.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-0">
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <DataTable 
                data={data}
                columns={columns}
                maxRows={10}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnalysisPage;