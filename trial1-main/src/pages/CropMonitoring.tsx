import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

interface CropData {
  id: string;
  crop_type: string;
  growth_stage: string;
  yield_potential: number;
  field_location: string | null;
  planting_date: string | null;
  expected_harvest: string | null;
  created_at: string;
  updated_at: string;
}

interface SoilData {
  id: string;
  moisture: number;
  ph: number;
  nitrogen: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const CropMonitoring: React.FC = () => {
  const [cropData, setCropData] = useState<CropData[]>([]);
  const [soilData, setSoilData] = useState<SoilData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch crop data
      const { data: crops, error: cropError } = await supabase
        .from('crop_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (cropError) throw cropError;

      // Fetch soil data for moisture trend
      const { data: soil, error: soilError } = await supabase
        .from('soil_data')
        .select('*')
        .order('created_at', { ascending: true });

      if (soilError) throw soilError;

      setCropData(crops || []);
      setSoilData(soil || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load crop monitoring data');
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const moistureTrendData = soilData.map((record, index) => ({
    week: `Week ${index + 1}`,
    moisture: record.moisture,
    ph: record.ph,
    nitrogen: record.nitrogen
  }));

  const yieldPredictionData = cropData.map(crop => ({
    crop: crop.crop_type,
    predicted: crop.yield_potential,
    actual: Math.random() * 20 + (crop.yield_potential - 10), // Simulated actual yield
    field: crop.field_location || 'Unknown'
  }));

  const growthStageData = cropData.reduce((acc, crop) => {
    const existing = acc.find(item => item.stage === crop.growth_stage);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ stage: crop.growth_stage, count: 1 });
    }
    return acc;
  }, [] as { stage: string; count: number }[]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <Activity className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            👁️ Krishi Mitra - Crop Monitoring
          </h1>
          <p className="text-gray-600">Track crop growth and soil conditions with data visualization</p>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Soil Moisture Trend */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Soil Moisture Trend
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moistureTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
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
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Yield Prediction */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Yield Prediction vs Actual
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
                    <Bar dataKey="predicted" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Growth Stage Distribution */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-6 w-6" />
                  Growth Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={growthStageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ stage, count }) => `${stage}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {growthStageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Soil Health Overview */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  Soil Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moistureTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="week" stroke="#6b7280" />
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
                      dataKey="ph" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="nitrogen" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Monitoring Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">
                    {cropData.length}
                  </p>
                  <p className="text-gray-600">Total Crops</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {moistureTrendData.length > 0 ? 
                      Math.round(moistureTrendData[moistureTrendData.length - 1].moisture) : 0}%
                  </p>
                  <p className="text-gray-600">Latest Moisture</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">
                    {moistureTrendData.length > 0 ? 
                      moistureTrendData[moistureTrendData.length - 1].ph : 0}
                  </p>
                  <p className="text-gray-600">Latest pH</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {cropData.length > 0 ? 
                      Math.round(cropData.reduce((sum, crop) => sum + crop.yield_potential, 0) / cropData.length) : 0}%
                  </p>
                  <p className="text-gray-600">Avg Yield Potential</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CropMonitoring;
