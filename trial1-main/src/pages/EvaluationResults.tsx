import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Mail, 
  Volume2, 
  VolumeX,
  ArrowLeft,
  Download,
  Leaf,
  Droplets,
  Thermometer,
  Activity
} from 'lucide-react';
import AgriculturalIcons from '@/components/AgriculturalIcons';

interface SoilData {
  moisture: number;
  ph: number;
  nitrogen: number;
  notes?: string;
}

interface EvaluationResult {
  category: string;
  status: 'good' | 'warning' | 'critical';
  message: string;
  recommendation: string;
  icon: React.ComponentType<any>;
}

const EvaluationResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [evaluationResults, setEvaluationResults] = useState<EvaluationResult[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Get soil data from location state or default values
    const data = location.state?.soilData || {
      moisture: 72,
      ph: 6.8,
      nitrogen: 85,
      notes: 'Sample evaluation data'
    };
    setSoilData(data);
    
    // Generate evaluation results based on soil data
    generateEvaluationResults(data);
  }, [location.state]);

  const generateEvaluationResults = (data: SoilData) => {
    const results: EvaluationResult[] = [];

    // Soil pH Analysis
    if (data.ph < 6.0) {
      results.push({
        category: 'Soil pH',
        status: 'critical',
        message: 'Soil pH is too low',
        recommendation: 'Add lime to increase pH to 6.0-7.0 range',
        icon: Thermometer
      });
    } else if (data.ph > 8.0) {
      results.push({
        category: 'Soil pH',
        status: 'warning',
        message: 'Soil pH is too high',
        recommendation: 'Add sulfur or organic matter to lower pH',
        icon: Thermometer
      });
    } else {
      results.push({
        category: 'Soil pH',
        status: 'good',
        message: 'Soil pH is optimal',
        recommendation: 'Maintain current pH level',
        icon: Thermometer
      });
    }

    // Moisture Analysis
    if (data.moisture < 50) {
      results.push({
        category: 'Soil Moisture',
        status: 'critical',
        message: 'Soil moisture is too low',
        recommendation: 'Increase irrigation frequency',
        icon: Droplets
      });
    } else if (data.moisture > 85) {
      results.push({
        category: 'Soil Moisture',
        status: 'warning',
        message: 'Soil moisture is too high',
        recommendation: 'Reduce irrigation and improve drainage',
        icon: Droplets
      });
    } else {
      results.push({
        category: 'Soil Moisture',
        status: 'good',
        message: 'Soil moisture is optimal',
        recommendation: 'Maintain current irrigation schedule',
        icon: Droplets
      });
    }

    // Nitrogen Analysis
    if (data.nitrogen < 50) {
      results.push({
        category: 'Nitrogen Level',
        status: 'critical',
        message: 'Nitrogen level is too low',
        recommendation: 'Apply nitrogen fertilizer (urea or ammonium nitrate)',
        icon: Activity
      });
    } else if (data.nitrogen > 120) {
      results.push({
        category: 'Nitrogen Level',
        status: 'warning',
        message: 'Nitrogen level is too high',
        recommendation: 'Reduce nitrogen application to prevent leaching',
        icon: Activity
      });
    } else {
      results.push({
        category: 'Nitrogen Level',
        status: 'good',
        message: 'Nitrogen level is adequate',
        recommendation: 'Continue current fertilization program',
        icon: Activity
      });
    }

    setEvaluationResults(results);
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN'; // Indian English
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const speakAllResults = () => {
    const allText = evaluationResults.map(result => 
      `${result.category}: ${result.message}. Recommendation: ${result.recommendation}`
    ).join('. ');
    
    speakText(`Krishi Mitra Evaluation Results. ${allText}`);
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@gmail.com')) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid Gmail address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save evaluation results to Supabase
      const { error } = await supabase
        .from('evaluation_results')
        .insert([{
          email: email,
          soil_data: soilData,
          evaluation_results: evaluationResults,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Report will be sent to your email. Thank you!",
      });

      // Reset form
      setEmail('');
    } catch (err) {
      console.error('Error saving evaluation:', err);
      toast({
        title: "Error",
        description: "Failed to save evaluation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-gray-600" />;
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

  if (!soilData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading evaluation results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-green-800">
                Krishi Mitra Evaluation Results
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              Your soil analysis is complete! Here are the results and recommendations.
            </p>
            
            {/* Subtle Agricultural Icons */}
            <div className="mb-8 flex justify-center gap-6">
              <AgriculturalIcons type="soil" size="lg" />
              <AgriculturalIcons type="crops" size="lg" />
              <AgriculturalIcons type="growth" size="lg" />
            </div>
            
            {/* Voice Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <Button
                onClick={isVoiceEnabled ? stopSpeaking : speakAllResults}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="h-4 w-4 mr-2" />
                    Stop Speaking
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen to Results
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Soil Data Summary */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-6 w-6" />
                  Your Soil Data
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Droplets className="h-8 w-8 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{soilData.moisture}%</p>
                    <p className="text-sm text-gray-600">Moisture</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Thermometer className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-2xl font-bold text-red-600">{soilData.ph}</p>
                    <p className="text-sm text-gray-600">pH Level</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{soilData.nitrogen}</p>
                    <p className="text-sm text-gray-600">Nitrogen (ppm)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Evaluation Results */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-green-800 mb-6 text-center">
              📊 Evaluation Results
            </h2>
            <div className="space-y-4">
              {evaluationResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="shadow-lg border-green-200 hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          {getStatusIcon(result.status)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {result.category}
                            </h3>
                            <Badge className={getStatusColor(result.status)}>
                              {result.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-3 font-medium">
                            {result.message}
                          </p>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Recommendation:</strong>
                            </p>
                            <p className="text-gray-800">
                              {result.recommendation}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => speakText(`${result.category}: ${result.message}. Recommendation: ${result.recommendation}`)}
                          className="border-green-300 text-green-700 hover:bg-green-50"
                        >
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gmail Collection */}
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg border-green-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  Get Detailed Report via Email
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Enter your Gmail address to receive a detailed report with all recommendations and action plans.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Gmail Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@gmail.com"
                      className="h-12 text-lg"
                    />
                  </div>
                  <Button
                    onClick={handleEmailSubmit}
                    disabled={isSubmitting || !email}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending Report...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Detailed Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/soil-data')}
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 h-12 px-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Test Another Sample
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 hover:bg-green-700 text-white h-12 px-8"
            >
              <Download className="h-4 w-4 mr-2" />
              Go to Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EvaluationResults;
