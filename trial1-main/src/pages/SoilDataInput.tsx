import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useChatSidebar } from '@/components/GlobalChatSidebar';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AgriculturalIcons from '@/components/AgriculturalIcons';
import { 
  Droplets, 
  Thermometer, 
  Leaf, 
  Sun, 
  Cloud, 
  CloudRain, 
  Camera, 
  Upload,
  CheckCircle,
  Loader2,
  Home,
  ArrowLeft
} from 'lucide-react';

// Form validation schema
const soilDataSchema = z.object({
  farmerId: z.string().min(1, 'Farmer ID is required'),
  soilMoisture: z.number().min(0).max(100, 'Soil moisture must be between 0-100%'),
  soilPh: z.number().min(0).max(14, 'Soil pH must be between 0-14'),
  nitrogen: z.number().min(0, 'Nitrogen must be a positive number'),
  phosphorus: z.number().min(0, 'Phosphorus must be a positive number'),
  potassium: z.number().min(0, 'Potassium must be a positive number'),
  weatherCondition: z.enum(['Sunny', 'Rainy', 'Cloudy'], {
    required_error: 'Please select weather condition'
  }),
  notes: z.string().optional()
});

type SoilDataForm = z.infer<typeof soilDataSchema>;

const SoilDataInput: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [soilImage, setSoilImage] = useState<File | null>(null);
  const [waterImage, setWaterImage] = useState<File | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { closeSidebar } = useChatSidebar();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SoilDataForm>({
    resolver: zodResolver(soilDataSchema),
    defaultValues: {
      farmerId: '',
      soilMoisture: 0,
      soilPh: 7,
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      weatherCondition: 'Sunny',
      notes: ''
    }
  });

  const weatherCondition = watch('weatherCondition');

  // Handle image upload
  const handleImageUpload = (file: File, type: 'soil' | 'water') => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    if (type === 'soil') {
      setSoilImage(file);
    } else {
      setWaterImage(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File, type: 'soil' | 'water'): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}_${Date.now()}.${fileExt}`;
      const filePath = `soil-data-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('soil-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('soil-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      return null;
    }
  };

  // Submit form data
  const onSubmit = async (data: SoilDataForm) => {
    setIsSubmitting(true);
    
    try {
      // Upload images if provided
      let soilImageUrl = null;
      let waterImageUrl = null;

      if (soilImage) {
        soilImageUrl = await uploadImage(soilImage, 'soil');
      }
      
      if (waterImage) {
        waterImageUrl = await uploadImage(waterImage, 'water');
      }

      // Save soil data to database
      const { error } = await supabase
        .from('soil_data')
        .insert({
          farmer_id: data.farmerId,
          soil_moisture: data.soilMoisture,
          soil_ph: data.soilPh,
          nitrogen: data.nitrogen,
          phosphorus: data.phosphorus,
          potassium: data.potassium,
          weather_condition: data.weatherCondition,
          soil_image_url: soilImageUrl,
          water_image_url: waterImageUrl,
          notes: data.notes || null
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your soil data has been saved successfully.",
      });

      // Navigate to evaluation results with soil data
      navigate('/evaluation-results', {
        state: {
          soilData: {
            moisture: data.soilMoisture,
            ph: data.soilPh,
            nitrogen: data.nitrogen,
            notes: data.notes
          }
        }
      });

      // Reset form
      setSoilImage(null);
      setWaterImage(null);
      
    } catch (error) {
      console.error('Error saving soil data:', error);
      toast({
        title: "Error",
        description: "Failed to save soil data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return <Sun className="h-6 w-6 text-yellow-500" />;
      case 'Rainy':
        return <CloudRain className="h-6 w-6 text-blue-500" />;
      case 'Cloudy':
        return <Cloud className="h-6 w-6 text-gray-500" />;
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => {
              closeSidebar();
              navigate('/');
            }}
            className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            🌱 Krishi Mitra - Soil & Water Analysis
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Enter your soil data to get AI-powered recommendations
          </p>
          
          {/* Subtle Agricultural Icons */}
          <div className="mb-6 flex justify-center gap-4">
            <AgriculturalIcons type="soil" size="md" />
            <AgriculturalIcons type="water" size="md" />
            <AgriculturalIcons type="sun" size="md" />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-green-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">
              📊 Soil Data Collection Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Farmer ID */}
              <div className="space-y-2">
                <Label htmlFor="farmerId" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  👤 Your Farmer ID
                </Label>
                <Input
                  id="farmerId"
                  {...register('farmerId')}
                  className="h-12 text-lg"
                  placeholder="Enter your farmer ID"
                />
                {errors.farmerId && (
                  <p className="text-red-500 text-sm">{errors.farmerId.message}</p>
                )}
              </div>

              {/* Soil Moisture */}
              <div className="space-y-2">
                <Label htmlFor="soilMoisture" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <Droplets className="h-6 w-6 text-blue-500" />
                  Soil Moisture (%)
                </Label>
                <Input
                  id="soilMoisture"
                  type="number"
                  step="0.1"
                  {...register('soilMoisture', { valueAsNumber: true })}
                  className="h-12 text-lg"
                  placeholder="0-100%"
                />
                {errors.soilMoisture && (
                  <p className="text-red-500 text-sm">{errors.soilMoisture.message}</p>
                )}
              </div>

              {/* Soil pH */}
              <div className="space-y-2">
                <Label htmlFor="soilPh" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <Thermometer className="h-6 w-6 text-red-500" />
                  Soil pH Level
                </Label>
                <Input
                  id="soilPh"
                  type="number"
                  step="0.1"
                  {...register('soilPh', { valueAsNumber: true })}
                  className="h-12 text-lg"
                  placeholder="0-14"
                />
                {errors.soilPh && (
                  <p className="text-red-500 text-sm">{errors.soilPh.message}</p>
                )}
              </div>

              {/* NPK Nutrients */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nitrogen" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-green-500" />
                    Nitrogen (N)
                  </Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    step="0.1"
                    {...register('nitrogen', { valueAsNumber: true })}
                    className="h-12 text-lg"
                    placeholder="N level"
                  />
                  {errors.nitrogen && (
                    <p className="text-red-500 text-sm">{errors.nitrogen.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phosphorus" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-purple-500" />
                    Phosphorus (P)
                  </Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    step="0.1"
                    {...register('phosphorus', { valueAsNumber: true })}
                    className="h-12 text-lg"
                    placeholder="P level"
                  />
                  {errors.phosphorus && (
                    <p className="text-red-500 text-sm">{errors.phosphorus.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="potassium" className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Leaf className="h-6 w-6 text-orange-500" />
                    Potassium (K)
                  </Label>
                  <Input
                    id="potassium"
                    type="number"
                    step="0.1"
                    {...register('potassium', { valueAsNumber: true })}
                    className="h-12 text-lg"
                    placeholder="K level"
                  />
                  {errors.potassium && (
                    <p className="text-red-500 text-sm">{errors.potassium.message}</p>
                  )}
                </div>
              </div>

              {/* Weather Condition */}
              <div className="space-y-2">
                <Label className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  {getWeatherIcon(weatherCondition)}
                  Weather Condition
                </Label>
                <Select onValueChange={(value) => setValue('weatherCondition', value as any)}>
                  <SelectTrigger className="h-12 text-lg">
                    <SelectValue placeholder="Select weather condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sunny">☀️ Sunny</SelectItem>
                    <SelectItem value="Rainy">🌧️ Rainy</SelectItem>
                    <SelectItem value="Cloudy">☁️ Cloudy</SelectItem>
                  </SelectContent>
                </Select>
                {errors.weatherCondition && (
                  <p className="text-red-500 text-sm">{errors.weatherCondition.message}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Camera className="h-6 w-6 text-gray-600" />
                    Soil Image
                  </Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'soil')}
                      className="hidden"
                      id="soil-image"
                    />
                    <label htmlFor="soil-image" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {soilImage ? soilImage.name : 'Click to upload soil photo'}
                      </p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <Camera className="h-6 w-6 text-blue-600" />
                    Water Image
                  </Label>
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'water')}
                      className="hidden"
                      id="water-image"
                    />
                    <label htmlFor="water-image" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {waterImage ? waterImage.name : 'Click to upload water photo'}
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-semibold text-green-800">
                  📝 Additional Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  className="min-h-[100px] text-lg"
                  placeholder="Any additional observations or notes..."
                />
              </div>

              {/* Submit and Back Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    closeSidebar();
                    navigate('/');
                  }}
                  className="h-14 px-8 text-green-700 border-green-300 hover:bg-green-50 text-lg font-semibold"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Back to Home
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 px-12 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Evaluate My Soil
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center text-gray-600 space-y-2">
          <p className="text-sm">
            💡 <strong>Tip:</strong> Take clear photos of your soil and water samples for better analysis results.
          </p>
          <p className="text-sm">
            📱 <strong>Mobile Friendly:</strong> This form works great on phones and tablets for field use.
          </p>
          <p className="text-sm">
            🔒 <strong>Secure:</strong> Your data is safely stored and only you can access your records.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SoilDataInput;
