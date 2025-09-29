import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useNavigate } from 'react-router-dom';
import {
  Leaf,
  Droplets,
  Activity,
  Zap,
  AlertTriangle,
  Eye,
  BarChart3,
  Cloud,
  Sun,
  CloudRain,
  TrendingUp,
  BarChart,
  ArrowRight,
  Calendar,
  MapPin
} from 'lucide-react';

// Sample data
const soilMoistureData = [
  { date: 'Jan', value: 65 },
  { date: 'Feb', value: 59 },
  { date: 'Mar', value: 80 },
  { date: 'Apr', value: 81 },
  { date: 'May', value: 56 },
  { date: 'Jun', value: 55 },
];

const yieldPredictionData = [
  { crop: 'Wheat', actual: 28, predicted: 32 },
  { crop: 'Rice', actual: 40, predicted: 45 },
  { crop: 'Corn', actual: 35, predicted: 39 },
];

const pestAlerts = [
  { id: 1, type: 'Aphids', location: 'North Field', date: 'Today', severity: 'High' },
  { id: 2, type: 'Fungal Infection', location: 'South Field', date: 'Yesterday', severity: 'Medium' },
];

const SimpleDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('en');

  // Language translations
  const t = {
    farmDashboard: 'Farm Dashboard',
    soilHealth: 'Soil Health Status',
    moisture: 'Moisture',
    phLevel: 'pH Level',
    nitrogen: 'Nitrogen',
    overallStatus: 'Overall Status',
    updateSoilData: 'Update Soil Data',
    cropHealth: 'Crop Health',
    growthStage: 'Growth Stage',
    yieldPotential: 'Yield Potential',
    lastUpdate: 'Last Update',
    pestAlerts: 'Pest Alerts',
    viewAll: 'View All',
    yieldPrediction: 'Yield Prediction',
    currentEstimate: 'Current Estimate',
    potentialYield: 'Potential Yield',
    lastSeason: 'Last Season',
    quintalsPerAcre: 'q/acre',
    weatherForecast: 'Weather Forecast',
    soilMoistureTrend: 'Soil Moisture Trend',
  };

  // Function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200';
      case 'low':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Header with Language Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4 rounded-lg shadow-lg inline-flex items-center gap-3 mb-2">
              <Leaf className="h-6 w-6" />
              <h1 className="text-2xl font-bold">{t.farmDashboard}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 ml-2">
              Monitor your farm's health and performance
            </p>
          </div>
          <LanguageSelector />
        </div>

        {/* Main Dashboard Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Soil Health Panel */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <span>{t.soilHealth}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Moisture */}
                  <div className="bg-blue-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">{t.moisture}</h3>
                      <Droplets className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-blue-600">68%</span>
                      <span className="text-sm text-green-600">+2.5%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>

                  {/* pH Level */}
                  <div className="bg-purple-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">{t.phLevel}</h3>
                      <Activity className="h-5 w-5 text-purple-500" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-purple-600">6.8</span>
                      <span className="text-sm text-gray-500">Optimal</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>

                  {/* Nitrogen */}
                  <div className="bg-green-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">{t.nitrogen}</h3>
                      <Zap className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-green-600">42</span>
                      <span className="text-sm text-gray-500">kg/ha</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  {/* Overall Status */}
                  <div className="bg-amber-50 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-gray-500">{t.overallStatus}</h3>
                      <Leaf className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-amber-600">Good</span>
                      <Badge className="bg-amber-100 text-amber-800 mt-2 self-start">
                        Needs Attention
                      </Badge>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-300"
                  onClick={() => navigate('/soil-data')}
                >
                  {t.updateSoilData}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Crop Health & Pest Alerts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Crop Health Panel */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Eye className="h-6 w-6" />
                    </div>
                    <span>{t.cropHealth}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t.growthStage}</p>
                        <span className="text-xl font-bold text-blue-600">Flowering</span>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t.yieldPotential}</p>
                        <span className="text-xl font-bold text-green-600">85%</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t.lastUpdate}</p>
                        <span className="text-sm font-medium">2 days ago</span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Growth Progress</span>
                        <span className="text-sm font-bold text-blue-600">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: '85%' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pest Alerts Panel */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <span>{t.pestAlerts}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pestAlerts.map((alert) => (
                      <div key={alert.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">{alert.type}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3" />
                            <span>{alert.location}</span>
                            <Calendar className="h-3 w-3 ml-2" />
                            <span>{alert.date}</span>
                          </div>
                        </div>
                        <Badge className={`${getSeverityColor(alert.severity)} px-3 py-1.5`}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                    <Button 
                      className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all duration-300 py-3"
                      onClick={() => navigate('/dashboard/pest-alerts')}
                    >
                      {t.viewAll}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Yield Prediction & Weather Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Yield Prediction Panel */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <span>{t.yieldPrediction}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-5">
                    <div className="flex items-center justify-center mb-2">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
                        <div 
                          className="absolute inset-0 rounded-full border-8 border-purple-500 border-t-transparent border-r-transparent"
                          style={{ transform: 'rotate(250deg)' }}
                        ></div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">32</div>
                          <div className="text-xs text-gray-500">{t.quintalsPerAcre}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-purple-50 rounded-lg p-4 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t.potentialYield}</p>
                        <span className="text-xl font-bold text-green-600">
                          38 <span className="text-xs">{t.quintalsPerAcre}</span>
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{t.lastSeason}</p>
                        <span className="text-xl font-bold text-gray-600">
                          30 <span className="text-xs">{t.quintalsPerAcre}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Current vs Potential</span>
                        <span className="text-sm font-bold text-purple-600">
                          84%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: '84%' }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weather Panel */}
            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border border-gray-100 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-500 text-white p-5">
                  <CardTitle className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Cloud className="h-6 w-6" />
                    </div>
                    <span>{t.weatherForecast}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg">
                    <div>
                      <p className="text-3xl font-bold text-blue-700">28°C</p>
                      <p className="text-gray-600 mt-1">Partly Cloudy</p>
                      <p className="text-xs text-gray-500 mt-1">Humidity: 65%</p>
                    </div>
                    <div className="bg-white p-4 rounded-full shadow-md">
                      <Cloud className="h-14 w-14 text-blue-500" />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    {['Mon', 'Tue', 'Wed', 'Thu'].map((day, i) => (
                      <div key={day} className="bg-blue-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300">
                        <p className="text-sm font-medium text-blue-800">{day}</p>
                        <div className="text-blue-500 my-2">
                          {i === 0 && <Cloud className="h-8 w-8 mx-auto" />}
                          {i === 1 && <Sun className="h-8 w-8 mx-auto text-amber-500" />}
                          {i === 2 && <CloudRain className="h-8 w-8 mx-auto" />}
                          {i === 3 && <Sun className="h-8 w-8 mx-auto text-amber-500" />}
                        </div>
                        <p className="text-sm font-bold">
                          {27 + i}°C
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Soil Moisture Trend */}
            <Card className="shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <span>{t.soilMoistureTrend}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500">Soil Moisture Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            {/* Yield Prediction */}
            <Card className="shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-5">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <span>{t.yieldPrediction}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500">Yield Prediction Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleDashboard;
