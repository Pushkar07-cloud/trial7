import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  FileImage,
  Calendar,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface ReportData {
  soilData: any[];
  cropData: any[];
  pestAlerts: any[];
  summary: {
    totalSoilRecords: number;
    totalCrops: number;
    totalAlerts: number;
    averageMoisture: number;
    averageYield: number;
    activeAlerts: number;
  };
}

const Reports: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data
      const [soilResult, cropResult, pestResult] = await Promise.all([
        supabase.from('soil_data').select('*').order('created_at', { ascending: false }),
        supabase.from('crop_data').select('*').order('created_at', { ascending: false }),
        supabase.from('pest_alerts').select('*').order('created_at', { ascending: false })
      ]);

      if (soilResult.error) throw soilResult.error;
      if (cropResult.error) throw cropResult.error;
      if (pestResult.error) throw pestResult.error;

      const soilData = soilResult.data || [];
      const cropData = cropResult.data || [];
      const pestAlerts = pestResult.data || [];

      // Calculate summary statistics
      const averageMoisture = soilData.length > 0 
        ? soilData.reduce((sum, record) => sum + record.moisture, 0) / soilData.length 
        : 0;

      const averageYield = cropData.length > 0 
        ? cropData.reduce((sum, record) => sum + record.yield_potential, 0) / cropData.length 
        : 0;

      const activeAlerts = pestAlerts.filter(alert => alert.status === 'active').length;

      setData({
        soilData,
        cropData,
        pestAlerts,
        summary: {
          totalSoilRecords: soilData.length,
          totalCrops: cropData.length,
          totalAlerts: pestAlerts.length,
          averageMoisture: Math.round(averageMoisture * 10) / 10,
          averageYield: Math.round(averageYield * 10) / 10,
          activeAlerts
        }
      });
    } catch (err) {
      console.error('Error fetching report data:', err);
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSoilCSV = async () => {
    setGenerating('soil');
    try {
      generateCSV(data?.soilData || [], `soil_data_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setGenerating(null);
    }
  };

  const generateCropCSV = async () => {
    setGenerating('crop');
    try {
      generateCSV(data?.cropData || [], `crop_data_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setGenerating(null);
    }
  };

  const generatePestCSV = async () => {
    setGenerating('pest');
    try {
      generateCSV(data?.pestAlerts || [], `pest_alerts_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setGenerating(null);
    }
  };

  const generateAllDataCSV = async () => {
    setGenerating('all');
    try {
      const allData = [
        ...(data?.soilData || []).map(record => ({ ...record, data_type: 'soil' })),
        ...(data?.cropData || []).map(record => ({ ...record, data_type: 'crop' })),
        ...(data?.pestAlerts || []).map(record => ({ ...record, data_type: 'pest_alert' }))
      ];
      generateCSV(allData, `farm_data_${new Date().toISOString().split('T')[0]}`);
    } finally {
      setGenerating(null);
    }
  };

  const generatePDF = async () => {
    setGenerating('pdf');
    try {
      // For now, we'll create a simple text-based report
      // In a real app, you'd use a library like jsPDF or Puppeteer
      const reportContent = `
KRISHI MITRA - FARM REPORT
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
==================
Total Soil Records: ${data?.summary.totalSoilRecords || 0}
Total Crops: ${data?.summary.totalCrops || 0}
Total Alerts: ${data?.summary.totalAlerts || 0}
Average Moisture: ${data?.summary.averageMoisture || 0}%
Average Yield: ${data?.summary.averageYield || 0}%
Active Alerts: ${data?.summary.activeAlerts || 0}

SOIL DATA
=========
${(data?.soilData || []).map(record => 
  `Date: ${new Date(record.created_at).toLocaleDateString()}, Moisture: ${record.moisture}%, pH: ${record.ph}, Nitrogen: ${record.nitrogen}ppm`
).join('\n')}

CROP DATA
=========
${(data?.cropData || []).map(record => 
  `Crop: ${record.crop_type}, Stage: ${record.growth_stage}, Yield: ${record.yield_potential}%, Field: ${record.field_location || 'Unknown'}`
).join('\n')}

PEST ALERTS
===========
${(data?.pestAlerts || []).map(alert => 
  `Type: ${alert.alert_type}, Field: ${alert.field}, Severity: ${alert.severity}, Status: ${alert.status}`
).join('\n')}
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `farm_report_${new Date().toISOString().split('T')[0]}.txt`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setGenerating(null);
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
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
            <FileText className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Reports</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchReportData}
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
            📊 Krishi Mitra - Reports & Analytics
          </h1>
          <p className="text-gray-600">Generate and download comprehensive farm reports</p>
        </motion.div>

        {/* Summary Stats */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6" />
                Farm Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{data?.summary.totalSoilRecords}</p>
                  <p className="text-gray-600">Soil Records</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{data?.summary.totalCrops}</p>
                  <p className="text-gray-600">Crop Types</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{data?.summary.totalAlerts}</p>
                  <p className="text-gray-600">Total Alerts</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{data?.summary.averageMoisture}%</p>
                  <p className="text-gray-600">Avg Moisture</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{data?.summary.averageYield}%</p>
                  <p className="text-gray-600">Avg Yield</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{data?.summary.activeAlerts}</p>
                  <p className="text-gray-600">Active Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Soil Data CSV */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6" />
                  Soil Data CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Download all soil measurements as CSV file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {data?.summary.totalSoilRecords} records available
                </p>
                <Button
                  onClick={generateSoilCSV}
                  disabled={generating === 'soil' || (data?.summary.totalSoilRecords || 0) === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {generating === 'soil' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Crop Data CSV */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6" />
                  Crop Data CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Download all crop information as CSV file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {data?.summary.totalCrops} records available
                </p>
                <Button
                  onClick={generateCropCSV}
                  disabled={generating === 'crop' || (data?.summary.totalCrops || 0) === 0}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {generating === 'crop' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pest Alerts CSV */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6" />
                  Pest Alerts CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Download all pest alerts as CSV file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  {data?.summary.totalAlerts} records available
                </p>
                <Button
                  onClick={generatePestCSV}
                  disabled={generating === 'pest' || (data?.summary.totalAlerts || 0) === 0}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {generating === 'pest' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSV
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* All Data CSV */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-6 w-6" />
                  All Data CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Download all farm data in one CSV file
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Combined soil, crop, and pest data
                </p>
                <Button
                  onClick={generateAllDataCSV}
                  disabled={generating === 'all'}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {generating === 'all' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download All Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* PDF Report */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="h-6 w-6" />
                  PDF Report
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Generate comprehensive PDF report
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Summary with all farm statistics
                </p>
                <Button
                  onClick={generatePDF}
                  disabled={generating === 'pdf'}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {generating === 'pdf' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileImage className="h-4 w-4 mr-2" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Data Refresh */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Refresh Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Update report data from database
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: {new Date().toLocaleTimeString()}
                </p>
                <Button
                  onClick={fetchReportData}
                  disabled={loading}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Refresh Data
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;
