import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, FileSpreadsheet, Download, Zap, Settings } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';

const LandingPage: React.FC = () => {
  // Example features
  const features = [
    {
      icon: <FileSpreadsheet size={24} className="text-blue-600" />,
      title: 'Excel Import',
      description: 'Upload any Excel file and analyze your data instantly. Supports both .xls and .xlsx formats.'
    },
    {
      icon: <BarChart2 size={24} className="text-teal-600" />,
      title: 'Interactive Charts',
      description: 'Create beautiful 2D and 3D charts with just a few clicks. Customize axes, colors, and more.'
    },
    {
      icon: <Download size={24} className="text-purple-600" />,
      title: 'Export & Share',
      description: 'Download your visualizations in multiple formats or share them directly with others.'
    },
    {
      icon: <Zap size={24} className="text-orange-600" />,
      title: 'AI Insights',
      description: 'Get smart recommendations and insights about your data using our AI-powered analysis.'
    }
  ];

  // Example testimonials
  const testimonials = [
    {
      quote: "This platform has transformed how we analyze our quarterly reports. The visualizations are stunning and so easy to create.",
      author: "Jane Smith",
      company: "Marketing Director, TechCorp"
    },
    {
      quote: "We've cut our data analysis time in half. What used to take days now takes minutes with these powerful visualization tools.",
      author: "Mark Johnson",
      company: "Data Analyst, Finance Plus"
    },
    {
      quote: "The 3D charts have added a whole new dimension to our presentations. Our clients are impressed every time.",
      author: "Sarah Williams",
      company: "CEO, Insight Analytics"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 bg-gradient-to-br from-yellow-100 to-orange-200">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4">
                Transform Your Excel Data Into Powerful Visualizations
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Upload any Excel file and create beautiful, interactive charts in seconds. Analyze data, discover insights, and share your findings.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link to="/register">
                  <Button size="lg">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/examples">
                  <Button variant="outline" size="lg">
                    See Examples
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative flex justify-center">
  <div className="relative bg-white p-4 rounded-2xl shadow-xl w-full max-w-lg">
    <img 
      src="https://primathon.in/blog/wp-content/uploads/2024/05/data-interpretation-1.jpg" 
      alt="Data visualization dashboard" 
      className="rounded-lg shadow-sm w-full h-auto object-contain"
    />
    <div className="absolute -bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg">
      <BarChart2 size={32} className="text-blue-600" />
    </div>
  </div>
</div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Data Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to turn raw Excel data into meaningful, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full transform transition duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From Excel to insights in three simple steps
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8">
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center max-w-xs w-full">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileSpreadsheet size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Upload</h3>
              <p className="text-gray-600">
                Drag and drop your Excel file into our secure platform
              </p>
            </div>

            <div className="hidden md:block text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center max-w-xs w-full">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-4">
                <Settings size={32} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Configure</h3>
              <p className="text-gray-600">
                Select your data columns and choose from various chart types
              </p>
            </div>

            <div className="hidden md:block text-gray-400">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center max-w-xs w-full">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <BarChart2 size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Visualize</h3>
              <p className="text-gray-600">
                Get instant interactive visualizations to explore your data
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of professionals who trust our platform for their data visualization needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-8">
                  <div className="mb-4 text-4xl text-blue-400">"</div>
                  <p className="text-gray-700 mb-6 italic">
                    {testimonial.quote}
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of data professionals who use our platform daily to make better decisions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700" 
                size="lg"
              >
                Start Free Trial
              </Button>
            </Link>
            <Link to="/examples">
              <Button 
                className="bg-transparent border border-white text-white hover:bg-white hover:text-blue-600" 
                size="lg"
              >
                See Live Demos
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-75">
            No credit card required. Free plan includes up to 5 visualizations per month.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;