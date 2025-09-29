import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChatSidebar } from '@/components/GlobalChatSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  Droplets, 
  Thermometer, 
  Leaf, 
  Eye, 
  AlertTriangle, 
  FileText,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  Plus,
  MapPin,
  Calendar
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Sample data for charts
const soilMoistureData = [
  { date: 'Week 1', moisture: 65 },
  { date: 'Week 2', moisture: 68 },
  { date: 'Week 3', moisture: 72 },
  { date: 'Week 4', moisture: 69 },
  { date: 'Week 5', moisture: 74 },
  { date: 'Week 6', moisture: 71 }
];

const yieldPredictionData = [
  { crop: 'Wheat', predicted: 85, actual: 78 },
  { crop: 'Corn', predicted: 92, actual: 88 },
  { crop: 'Rice', predicted: 76, actual: 82 },
  { crop: 'Soybean', predicted: 89, actual: 85 }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { closeSidebar } = useChatSidebar();
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('english');
  
  // Language translations for multilingual support
  const translations = {
    english: {
      soilHealth: 'Soil Health Status',
      moisture: 'Moisture',
      ph: 'pH Level',
      nitrogen: 'Nitrogen',
      overall: 'Overall Status',
      cropHealth: 'Crop Health',
      growthStage: 'Growth Stage',
      yieldPotential: 'Yield Potential',
      lastUpdate: 'Last Updated',
      pestAlerts: 'Pest Alerts',
      viewAll: 'View All Alerts',
      soilMoistureTrend: 'Soil Moisture Trend (Weekly)',
      yieldPrediction: 'Yield Prediction',
      updateSoilData: 'Update Soil Data',
      farmDashboard: 'Farm Dashboard',
      monitor: 'Monitor your farm\'s health and performance',
      language: 'Language',
      selectLanguage: 'Select language'
    },
    hindi: {
      soilHealth: 'मिट्टी स्वास्थ्य स्थिति',
      moisture: 'नमी',
      ph: 'पीएच स्तर',
      nitrogen: 'नाइट्रोजन',
      overall: 'समग्र स्थिति',
      cropHealth: 'फसल स्वास्थ्य',
      growthStage: 'विकास चरण',
      yieldPotential: 'उपज क्षमता',
      lastUpdate: 'अंतिम अपडेट',
      pestAlerts: 'कीट अलर्ट',
      viewAll: 'सभी अलर्ट देखें',
      soilMoistureTrend: 'मिट्टी की नमी का रुझान (साप्ताहिक)',
      yieldPrediction: 'उपज का अनुमान',
      updateSoilData: 'मिट्टी का डेटा अपडेट करें',
      farmDashboard: 'खेत डैशबोर्ड',
      monitor: 'अपने खेत के स्वास्थ्य और प्रदर्शन की निगरानी करें',
      language: 'भाषा',
      selectLanguage: 'भाषा चुनें'
    },
    marathi: {
      soilHealth: 'मातीची आरोग्य स्थिती',
      moisture: 'ओलावा',
      ph: 'पीएच पातळी',
      nitrogen: 'नायट्रोजन',
      overall: 'एकूण स्थिती',
      cropHealth: 'पीक आरोग्य',
      growthStage: 'वाढीचा टप्पा',
      yieldPotential: 'उत्पादन क्षमता',
      lastUpdate: 'शेवटचे अपडेट',
      pestAlerts: 'कीटक सूचना',
      viewAll: 'सर्व सूचना पहा',
      soilMoistureTrend: 'मातीच्या ओलाव्याचा कल (साप्ताहिक)',
      yieldPrediction: 'उत्पादन अंदाज',
      updateSoilData: 'मातीचा डेटा अपडेट करा',
      farmDashboard: 'शेत डॅशबोर्ड',
      monitor: 'आपल्या शेताच्या आरोग्याचे आणि कामगिरीचे निरीक्षण करा',
      language: 'भाषा',
      selectLanguage: 'भाषा निवडा'
    },
    tamil: {
      soilHealth: 'மண் ஆரோக்கிய நிலை',
      moisture: 'ஈரப்பதம்',
      ph: 'பிஹெச் அளவு',
      nitrogen: 'நைட்ரஜன்',
      overall: 'ஒட்டுமொத்த நிலை',
      cropHealth: 'பயிர் ஆரோக்கியம்',
      growthStage: 'வளர்ச்சி நிலை',
      yieldPotential: 'விளைச்சல் திறன்',
      lastUpdate: 'கடைசி புதுப்பிப்பு',
      pestAlerts: 'பூச்சி எச்சரிக்கைகள்',
      viewAll: 'அனைத்து எச்சரிக்கைகளையும் காண்க',
      soilMoistureTrend: 'மண் ஈரப்பத போக்கு (வாராந்திர)',
      yieldPrediction: 'விளைச்சல் கணிப்பு',
      updateSoilData: 'மண் தரவைப் புதுப்பிக்கவும்',
      farmDashboard: 'பண்ணை டாஷ்போர்டு',
      monitor: 'உங்கள் பண்ணையின் ஆரோக்கியம் மற்றும் செயல்திறனைக் கண்காணிக்கவும்',
      language: 'மொழி',
      selectLanguage: 'மொழியை தேர்ந்தெடுக்கவும்'
    },
    telugu: {
      soilHealth: 'నేల ఆరోగ్య స్థితి',
      moisture: 'తేమ',
      ph: 'పిహెచ్ స్థాయి',
      nitrogen: 'నైట్రోజన్',
      overall: 'మొత్తం స్థితి',
      cropHealth: 'పంట ఆరోగ్యం',
      growthStage: 'వృద్ధి దశ',
      yieldPotential: 'దిగుబడి సామర్థ్యం',
      lastUpdate: 'చివరి నవీకరణ',
      pestAlerts: 'పురుగు హెచ్చరికలు',
      viewAll: 'అన్ని హెచ్చరికలను చూడండి',
      soilMoistureTrend: 'నేల తేమ ధోరణి (వారానికి)',
      yieldPrediction: 'దిగుబడి అంచనా',
      updateSoilData: 'నేల డేటాను నవీకరించండి',
      farmDashboard: 'వ్యవసాయ డాష్‌బోర్డ్',
      monitor: 'మీ వ్యవసాయం యొక్క ఆరోగ్యం మరియు పనితీరును పర్యవేక్షించండి',
      language: 'భాష',
      selectLanguage: 'భాషను ఎంచుకోండి'
    }
  };
  
  // Get translations for current language
  const t = translations[language];

  // Define sidebar items
  const sidebarItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'soil-health', label: 'Soil Health', icon: Droplets },
    { id: 'crop-monitoring', label: t.cropHealth, icon: Eye },
    { id: 'pest-alerts', label: t.pestAlerts, icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const pestAlerts = [
    { id: 1, type: 'Aphids', severity: 'low', location: 'Field A', date: '2 days ago' },
    { id: 2, type: 'Fungal Infection', severity: 'medium', location: 'Field B', date: '1 week ago' },
    { id: 3, type: 'Leaf Spot', severity: 'high', location: 'Field C', date: '3 days ago' }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Sidebar Navigation */}
        <motion.div 
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-64 bg-white dark:bg-gray-800 shadow-lg dark:shadow-green-900/20 border-r border-green-100 dark:border-green-800/30 min-h-screen p-6"
        >
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 dark:from-green-500 dark:to-green-600 rounded-lg flex items-center justify-center shadow-md dark:shadow-green-500/30">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-800 dark:text-green-300">Krishi Mitra</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Farmer Dashboard</p>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={() => {
                  setActiveTab(item.id);
                  closeSidebar();
                  if (item.id === 'home') {
                    navigate('/');
                  } else {
                    navigate(`/dashboard/${item.id}`);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700/50 shadow-sm dark:shadow-green-700/20'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-300'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 bg-gradient-to-br from-green-50 to-white">
          {/* Language Selector */}
          <div className="flex justify-end mb-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-[180px] border-green-200 shadow-sm">
                <SelectValue placeholder={t.selectLanguage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                <SelectItem value="tamil">தமிழ் (Tamil)</SelectItem>
                <SelectItem value="telugu">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            {/* Header with Green Background */}
            <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 mb-8 shadow-lg text-white">
              <div className="flex items-center mb-2">
                <div className="bg-white p-2 rounded-full mr-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold">
                  {t.farmDashboard}
                </h1>
              </div>
              <p className="text-green-100 ml-16">{t.monitor}</p>
            </motion.div>

            {/* Content based on active tab */}
            {activeTab === 'home' && (
              <>
                {/* Soil Health Panel */}
                <motion.div variants={itemVariants} className="mb-8">
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
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100 hover:border-blue-200 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.moisture}</p>
                            <div className="p-3 rounded-full bg-blue-500 text-white">
                              <Droplets className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-blue-600">72%</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '72%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100 hover:border-red-200 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.ph}</p>
                            <div className="p-3 rounded-full bg-red-500 text-white">
                              <Thermometer className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-red-600">6.8</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100 hover:border-green-200 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.nitrogen}</p>
                            <div className="p-3 rounded-full bg-green-500 text-white">
                              <Leaf className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-green-600">85</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-5 shadow-md border border-gray-100 hover:border-purple-200 transition-all">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{t.overall}</p>
                            <div className="p-3 rounded-full bg-purple-500 text-white">
                              <Activity className="h-6 w-6" />
                            </div>
                          </div>
                          <p className="text-3xl font-bold text-purple-600">Good</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => {
                          closeSidebar();
                          navigate('/soil-data');
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md transition-all duration-300 py-6"
                      >
                        <Plus className="h-5 w-5 mr-2" />
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
                              <span className="text-sm font-medium">2 hours ago</span>
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
                            onClick={() => {
                              closeSidebar();
                              navigate('/dashboard/pest-alerts');
                            }}
                          >
                            {t.viewAll}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Charts Section */}
                <motion.div variants={itemVariants}>
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
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={soilMoistureData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#f9fafb', 
                                border: '1px solid #d1d5db',
                                borderRadius: '8px'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="moisture" 
                              stroke="#059669" 
                              strokeWidth={3}
                              dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
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
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={yieldPredictionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="crop" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#f9fafb', 
                                border: '1px solid #d1d5db',
                                borderRadius: '8px'
                              }} 
                            />
                            <Bar dataKey="predicted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              </>
            )}
            
            {/* Soil Health Tab */}
            {activeTab === 'soil-health' && (
              <>
                <motion.div variants={itemVariants} className="mb-8">
                  <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2 drop-shadow-sm dark:drop-shadow-[0_1px_2px_rgba(0,255,0,0.15)]">
                    🌱 {t.soilHealth}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Detailed information about your soil's health and properties
                  </p>
                  
                  {/* Last Updated Timestamp */}
                  <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span>{t.lastUpdate}: 2 hours ago</span>
                  </div>
                  
                  {/* Soil Health Status Card */}
                  <Card className="shadow-lg dark:shadow-green-900/20 border-green-200 dark:border-green-800/30 dark:bg-gray-800/80 mb-8">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-600 text-white rounded-t-lg">
                      <CardTitle className="flex items-center gap-2">
                        <Droplets className="h-6 w-6" />
                        {t.soilHealth}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 dark:bg-gray-800/80">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md dark:shadow-blue-500/20">
                            <Droplets className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">72%</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t.moisture}</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                            Good
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md dark:shadow-red-500/20">
                            <Thermometer className="h-8 w-8 text-red-600 dark:text-red-400" />
                          </div>
                          <p className="text-2xl font-bold text-red-600 dark:text-red-400">6.8</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t.ph}</p>
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800 border-yellow-200">
                            Medium
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md dark:shadow-green-500/20">
                            <Leaf className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <p className="text-2xl font-bold text-green-600 dark:text-green-400">85</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t.nitrogen}</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                            Good
                          </Badge>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md dark:shadow-purple-500/20">
                            <Activity className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                          </div>
                          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Good</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{t.overall}</p>
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                            Good
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Crop Health & Pest Alerts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Crop Health Card */}
                    <Card className="shadow-lg border-green-200">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                          <Eye className="h-6 w-6" />
                          {t.cropHealth}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <MapPin className="h-12 w-12 text-green-600" />
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 mb-2">
                            <Zap className="h-3 w-3 mr-1" />
                            Healthy
                          </Badge>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.growthStage}:</span>
                            <span className="font-medium">Flowering</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.yieldPotential}:</span>
                            <span className="font-medium text-green-600">85%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{t.lastUpdate}:</span>
                            <span className="font-medium">2 hours ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pest Alerts Card */}
                    <Card className="shadow-lg border-green-200">
                      <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-6 w-6" />
                          {t.pestAlerts}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {pestAlerts.map((alert) => (
                            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-800">{alert.type}</p>
                                <p className="text-sm text-gray-600">{alert.location} • {alert.date}</p>
                              </div>
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4 border-green-300 text-green-700 hover:bg-green-50">
                          {t.viewAll}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Soil Moisture Trend Chart */}
                    <Card className="shadow-lg border-green-200">
                      <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-6 w-6" />
                          {t.soilMoistureTrend}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={soilMoistureData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="date" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#f9fafb', 
                                border: '1px solid #d1d5db',
                                borderRadius: '8px'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="moisture" 
                              stroke="#059669" 
                              strokeWidth={3}
                              dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Yield Prediction Chart */}
                    <Card className="shadow-lg border-green-200">
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                        <CardTitle className="flex items-center gap-2">
                          <BarChart className="h-6 w-6" />
                          {t.yieldPrediction}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={yieldPredictionData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="crop" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#f9fafb', 
                                border: '1px solid #d1d5db',
                                borderRadius: '8px'
                              }} 
                            />
                            <Bar dataKey="predicted" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="actual" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Update Soil Data Button */}
                  <Button 
                    onClick={() => {
                      closeSidebar();
                      navigate('/soil-data');
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white shadow-md dark:shadow-green-500/30 transition-all duration-300 py-6 text-lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {t.updateSoilData}
                  </Button>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
