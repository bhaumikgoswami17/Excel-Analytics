import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileSpreadsheet, HardDrive, Settings, Search, MoreVertical, Ban, Edit, Trash } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  filesUploaded: number;
  storageUsed: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin, if not redirect to dashboard
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'john.smith@example.com',
            name: 'John Smith',
            role: 'user',
            filesUploaded: 12,
            storageUsed: '45.2 MB',
            lastActive: '2023-05-15T10:32:00Z',
            status: 'active'
          },
          {
            id: '2',
            email: 'sarah.johnson@example.com',
            name: 'Sarah Johnson',
            role: 'user',
            filesUploaded: 8,
            storageUsed: '23.7 MB',
            lastActive: '2023-05-14T16:45:00Z',
            status: 'active'
          },
          {
            id: '3',
            email: 'michael.williams@example.com',
            name: 'Michael Williams',
            role: 'user',
            filesUploaded: 5,
            storageUsed: '12.4 MB',
            lastActive: '2023-05-10T09:20:00Z',
            status: 'inactive'
          },
          {
            id: '4',
            email: 'emily.brown@example.com',
            name: 'Emily Brown',
            role: 'user',
            filesUploaded: 20,
            storageUsed: '78.1 MB',
            lastActive: '2023-05-15T14:15:00Z',
            status: 'active'
          },
          {
            id: '5',
            email: 'david.jones@example.com',
            name: 'David Jones',
            role: 'user',
            filesUploaded: 3,
            storageUsed: '8.9 MB',
            lastActive: '2023-05-01T11:30:00Z',
            status: 'suspended'
          }
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, navigate]);

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

  const getStatusBadgeClass = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 pt-24 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage users and monitor system usage</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{users.length}</h3>
              <p className="text-xs text-green-600 flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                <span>+2 this week</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
              <FileSpreadsheet size={24} className="text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Files</p>
              <h3 className="text-3xl font-bold text-gray-900">48</h3>
              <p className="text-xs text-green-600 flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <path d="m18 15-6-6-6 6"/>
                </svg>
                <span>+15 this week</span>
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <HardDrive size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Storage Used</p>
              <h3 className="text-3xl font-bold text-gray-900">168.3 MB</h3>
              <p className="text-xs text-gray-600">of 10 GB allocated</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '1.68%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* User Management */}
      <Card className="mb-12">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <CardTitle>User Management</CardTitle>
            
            <div className="mt-4 md:mt-0 flex space-x-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full md:w-60 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <Button>
                Add User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Files
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Storage
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users size={20} className="text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.filesUploaded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.storageUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-500 hover:text-blue-600">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <Ban size={16} />
                        </button>
                        <button className="text-gray-500 hover:text-red-600">
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
      
      {/* System Settings */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center">
            <Settings size={20} className="mr-2" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Storage Limits</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Free Plan</span>
                    <span className="text-sm text-gray-600">1 GB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Pro Plan</span>
                    <span className="text-sm text-gray-600">10 GB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value="10"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Enterprise Plan</span>
                    <span className="text-sm text-gray-600">100 GB</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value="100"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <Button variant="outline" size="sm">
                  Update Limits
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Controls</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable 3D Charts</p>
                    <p className="text-xs text-gray-500">Allow users to create 3D visualizations</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <span className="block w-6 h-6 bg-white rounded-full transform translate-x-6 transition-transform"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">AI Analysis</p>
                    <p className="text-xs text-gray-500">Enable AI-powered data insights</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <span className="block w-6 h-6 bg-white rounded-full transform translate-x-6 transition-transform"></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Export Options</p>
                    <p className="text-xs text-gray-500">Allow users to export charts as PNG/PDF</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 rounded-full bg-green-500">
                    <input type="checkbox" className="sr-only" defaultChecked />
                    <span className="block w-6 h-6 bg-white rounded-full transform translate-x-6 transition-transform"></span>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;