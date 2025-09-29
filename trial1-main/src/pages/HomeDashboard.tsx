import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import SupabaseTest from '@/components/SupabaseTest';
import { 
  Droplets, 
  Thermometer, 
  Leaf, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react';

interface DashboardData {
  soilHealth: {
    latestMoisture: number;
    latestPh: number;
    latestNitrogen: number;
    trend: 'up' | 'down' | 'stable';
  };
  cropGrowth: {
    totalCrops: number;
    averageYield: number;
    healthyCrops: number;
  };
  pestAlerts: {
    total: number;
    high: number;
    medium: number;
    low: number;
  };
  yieldPrediction: {
    predicted: number;
    actual: number;
    confidence: number;
  };
}

const HomeDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch soil data
      const { data: soilData, error: soilError } = await supabase
        .from('soil_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (soilError) throw soilError;

      // Fetch crop data
      const { data: cropData, error: cropError } = await supabase
        .from('crop_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (cropError) throw cropError;

      // Fetch pest alerts
      const { data: pestData, error: pestError } = await supabase
        .from('pest_alerts')
        .select('*')
        .eq('status', 'active');

      if (pestError) throw pestError;

      // Process data
      const latestSoil = soilData?.[0];
      const soilTrend = soilData && soilData.length > 1 
        ? soilData[0].moisture > soilData[1].moisture ? 'up' : 'down'
        : 'stable';

      const averageYield = cropData?.length 
        ? cropData.reduce((sum, crop) => sum + crop.yield_potential, 0) / cropData.length
        : 0;

      const healthyCrops = cropData?.filter(crop => crop.yield_potential > 80).length || 0;

      const pestCounts = pestData?.reduce((acc, alert) => {
        acc[alert.severity] = (acc[alert.severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      setData({
        soilHealth: {
          latestMoisture: latestSoil?.moisture || 0,
          latestPh: latestSoil?.ph || 0,
          latestNitrogen: latestSoil?.nitrogen || 0,
          trend: soilTrend
        },
        cropGrowth: {
          totalCrops: cropData?.length || 0,
          averageYield: Math.round(averageYield),
          healthyCrops
        },
        pestAlerts: {
          total: pestData?.length || 0,
          high: pestCounts.high || 0,
          medium: pestCounts.medium || 0,
          low: pestCounts.low || 0
        },
        yieldPrediction: {
          predicted: 85,
          actual: Math.round(averageYield),
          confidence: 92
        }
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
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
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
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
    <div className="container mx-auto p-4 max-w-7xl">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="bg-white p-2 rounded-full mr-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Krishi Mitra Dashboard</h1>
              <p className="text-green-100 mt-1">Real-time overview of your farm's health and performance</p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Soil Moisture */}
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-blue-50 pb-0 pt-4 px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-blue-700 text-lg font-medium">Soil Moisture</CardTitle>
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Droplets className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-blue-600">{data?.soilHealth.latestMoisture}%</p>
                  <div className="flex items-center mb-1">
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      data?.soilHealth.trend === 'up' ? 'text-green-500' : 
                      data?.soilHealth.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`} />
                    <span className="text-xs text-gray-500 capitalize">{data?.soilHealth.trend}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last updated: Today, 2:30 PM</p>
              </CardContent>
            </Card>

            {/* Soil pH */}
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-red-50 pb-0 pt-4 px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-red-700 text-lg font-medium">Soil pH</CardTitle>
                  <div className="bg-red-100 p-2 rounded-full">
                    <Thermometer className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-red-600">{data?.soilHealth.latestPh}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Optimal range: 6.0-7.0</p>
              </CardContent>
            </Card>

            {/* Nitrogen Level */}
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-green-50 pb-0 pt-4 px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-green-700 text-lg font-medium">Nitrogen</CardTitle>
                  <div className="bg-green-100 p-2 rounded-full">
                    <Leaf className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-green-600">{data?.soilHealth.latestNitrogen}</p>
                  <span className="text-sm text-gray-500 mb-1">ppm</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Healthy range: 40-80 ppm</p>
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card className="shadow-lg border-none hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-orange-50 pb-0 pt-4 px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-orange-700 text-lg font-medium">Active Alerts</CardTitle>
                  <div className="bg-orange-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 pb-6 px-6">
                <p className="text-3xl font-bold text-orange-600">{data?.pestAlerts.total}</p>
                <div className="flex gap-2 mt-3">
                  <Badge variant="destructive" className="px-2 py-1">High: {data?.pestAlerts.high}</Badge>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200 px-2 py-1">Med: {data?.pestAlerts.medium}</Badge>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1">Low: {data?.pestAlerts.low}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Crop Growth Summary */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-5">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span>Crop Growth Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Crops</p>
                      <span className="text-2xl font-bold text-green-600">{data?.cropGrowth.totalCrops}</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Avg Yield</p>
                      <span className="text-2xl font-bold text-blue-600">{data?.cropGrowth.averageYield}%</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Healthy</p>
                      <span className="text-2xl font-bold text-green-600">{data?.cropGrowth.healthyCrops}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Health Score</span>
                      <span className="text-sm font-bold text-green-600">
                        {Math.round((data?.cropGrowth.healthyCrops / (data?.cropGrowth.totalCrops || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(data?.cropGrowth.healthyCrops / (data?.cropGrowth.totalCrops || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Yield Prediction */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-xl border border-gray-100 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-5">
                <CardTitle className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <Zap className="h-6 w-6" />
                  </div>
                  <span>Yield Prediction</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-purple-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Predicted</p>
                      <span className="text-2xl font-bold text-purple-600">{data?.yieldPrediction.predicted}%</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Actual</p>
                      <span className="text-2xl font-bold text-green-600">{data?.yieldPrediction.actual}%</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Confidence</p>
                      <span className="text-2xl font-bold text-blue-600">{data?.yieldPrediction.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">AI Confidence Level</span>
                      <span className="text-sm font-bold text-purple-600">{data?.yieldPrediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-purple-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${data?.yieldPrediction.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeDashboard;
