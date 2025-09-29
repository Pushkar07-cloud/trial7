import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Mic, MicOff, Phone, Mail, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(10, 'Contact number must be at least 10 digits').max(15, 'Contact number must not exceed 15 digits'),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  query_type: z.enum(['Soil Health', 'Crop Issue', 'Pest Alert', 'Other']),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

// Language translations
const translations = {
  en: {
    title: 'Contact Us',
    subtitle: 'We are here to help with your farming needs',
    nameLabel: 'Your Name (Optional)',
    namePlaceholder: 'Enter your name',
    phoneLabel: 'Contact Number',
    phonePlaceholder: 'Enter your phone number',
    emailLabel: 'Email (Optional)',
    emailPlaceholder: 'Enter your email',
    queryTypeLabel: 'Type of Query',
    messagePlaceholder: 'Enter your message or query here...',
    messageLabel: 'Your Message',
    submitButton: 'Submit Query',
    submitting: 'Submitting...',
    previousQueries: 'Your Previous Queries',
    helplineTitle: 'Regional Helpline Numbers',
    voiceInput: 'Voice Input',
    startRecording: 'Start Voice Input',
    stopRecording: 'Stop Recording',
    successMessage: 'Your query has been received. Our team will contact you soon.',
    queryTypes: {
      soilHealth: 'Soil Health',
      cropIssue: 'Crop Issue',
      pestAlert: 'Pest Alert',
      other: 'Other'
    },
    noQueries: 'No previous queries found.'
  },
  hi: {
    title: 'संपर्क करें',
    subtitle: 'हम आपकी कृषि आवश्यकताओं में मदद करने के लिए यहां हैं',
    nameLabel: 'आपका नाम (वैकल्पिक)',
    namePlaceholder: 'अपना नाम दर्ज करें',
    phoneLabel: 'संपर्क नंबर',
    phonePlaceholder: 'अपना फोन नंबर दर्ज करें',
    emailLabel: 'ईमेल (वैकल्पिक)',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    queryTypeLabel: 'प्रश्न का प्रकार',
    messagePlaceholder: 'अपना संदेश या प्रश्न यहां दर्ज करें...',
    messageLabel: 'आपका संदेश',
    submitButton: 'प्रश्न जमा करें',
    submitting: 'जमा कर रहा है...',
    previousQueries: 'आपके पिछले प्रश्न',
    helplineTitle: 'क्षेत्रीय हेल्पलाइन नंबर',
    voiceInput: 'आवाज इनपुट',
    startRecording: 'आवाज इनपुट शुरू करें',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    successMessage: 'आपका प्रश्न प्राप्त हो गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।',
    queryTypes: {
      soilHealth: 'मिट्टी का स्वास्थ्य',
      cropIssue: 'फसल समस्या',
      pestAlert: 'कीट चेतावनी',
      other: 'अन्य'
    },
    noQueries: 'कोई पिछला प्रश्न नहीं मिला।'
  },
  te: {
    title: 'సంప్రదించండి',
    subtitle: 'మేము మీ వ్యవసాయ అవసరాలకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము',
    nameLabel: 'మీ పేరు (ఐచ్ఛికం)',
    namePlaceholder: 'మీ పేరు నమోదు చేయండి',
    phoneLabel: 'సంప్రదింపు నంబర్',
    phonePlaceholder: 'మీ ఫోన్ నంబర్‌ను నమోదు చేయండి',
    emailLabel: 'ఇమెయిల్ (ఐచ్ఛికం)',
    emailPlaceholder: 'మీ ఇమెయిల్‌ను నమోదు చేయండి',
    queryTypeLabel: 'ప్రశ్న రకం',
    messagePlaceholder: 'మీ సందేశం లేదా ప్రశ్నను ఇక్కడ నమోదు చేయండి...',
    messageLabel: 'మీ సందేశం',
    submitButton: 'ప్రశ్నను సమర్పించండి',
    submitting: 'సమర్పిస్తోంది...',
    previousQueries: 'మీ మునుపటి ప్రశ్నలు',
    helplineTitle: 'ప్రాంతీయ హెల్ప్‌లైన్ నంబర్లు',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    startRecording: 'వాయిస్ ఇన్‌పుట్ ప్రారంభించండి',
    stopRecording: 'రికార్డింగ్ ఆపండి',
    successMessage: 'మీ ప్రశ్న స్వీకరించబడింది. మా బృందం త్వరలో మిమ్మల్ని సంప్రదిస్తుంది.',
    queryTypes: {
      soilHealth: 'నేల ఆరోగ్యం',
      cropIssue: 'పంట సమస్య',
      pestAlert: 'పురుగుల హెచ్చరిక',
      other: 'ఇతర'
    },
    noQueries: 'మునుపటి ప్రశ్నలు కనుగొనబడలేదు.'
  },
  ta: {
    title: 'தொடர்பு கொள்ளவும்',
    subtitle: 'உங்கள் விவசாய தேவைகளுக்கு உதவ நாங்கள் இங்கே இருக்கிறோம்',
    nameLabel: 'உங்கள் பெயர் (விருப்பம்)',
    namePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
    phoneLabel: 'தொடர்பு எண்',
    phonePlaceholder: 'உங்கள் தொலைபேசி எண்ணை உள்ளிடவும்',
    emailLabel: 'மின்னஞ்சல் (விருப்பம்)',
    emailPlaceholder: 'உங்கள் மின்னஞ்சலை உள்ளிடவும்',
    queryTypeLabel: 'கேள்வி வகை',
    messagePlaceholder: 'உங்கள் செய்தி அல்லது கேள்வியை இங்கே உள்ளிடவும்...',
    messageLabel: 'உங்கள் செய்தி',
    submitButton: 'கேள்வியை சமர்ப்பிக்கவும்',
    submitting: 'சமர்ப்பிக்கிறது...',
    previousQueries: 'உங்கள் முந்தைய கேள்விகள்',
    helplineTitle: 'பிராந்திய உதவி எண்கள்',
    voiceInput: 'குரல் உள்ளீடு',
    startRecording: 'குரல் உள்ளீட்டைத் தொடங்கவும்',
    stopRecording: 'பதிவை நிறுத்தவும்',
    successMessage: 'உங்கள் கேள்வி பெறப்பட்டது. எங்கள் குழு விரைவில் உங்களைத் தொடர்பு கொள்ளும்.',
    queryTypes: {
      soilHealth: 'மண் ஆரோக்கியம்',
      cropIssue: 'பயிர் பிரச்சனை',
      pestAlert: 'பூச்சி எச்சரிக்கை',
      other: 'மற்றவை'
    },
    noQueries: 'முந்தைய கேள்விகள் எதுவும் கிடைக்கவில்லை.'
  }
};

// Regional helpline numbers (hardcoded for now)
const helplineNumbers = [
  { region: 'North India', number: '1800-180-1551' },
  { region: 'South India', number: '1800-425-1556' },
  { region: 'East India', number: '1800-345-6789' },
  { region: 'West India', number: '1800-233-4000' },
  { region: 'Central India', number: '1800-121-5555' },
];

const ContactUs: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [previousQueries, setPreviousQueries] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Get translations based on selected language
  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      query_type: 'Soil Health',
      message: ''
    }
  });

  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  // Toggle voice recording
  const toggleRecording = () => {
    // This would be replaced with actual Google Speech-to-Text API integration
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: "Voice recording stopped",
        description: "Voice input would be processed here in a real implementation."
      });
    } else {
      setIsRecording(true);
      toast({
        title: "Voice recording started",
        description: "Speak your query clearly..."
      });
      
      // Simulate voice recording after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        setValue('message', 'This is a sample voice message that would be transcribed from actual speech in a real implementation.');
        toast({
          title: "Voice transcribed",
          description: "Your voice has been converted to text."
        });
      }, 3000);
    }
  };

  // Fetch previous queries when phone number changes
  const fetchPreviousQueries = async (phone: string) => {
    if (!phone || phone.length < 10) return;
    
    try {
      const { data, error } = await supabase
        .from('contact_queries')
        .select('*')
        .eq('phone', phone)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setPreviousQueries(data || []);
    } catch (error) {
      console.error('Error fetching previous queries:', error);
    }
  };

  // Handle form submission
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('contact_queries')
        .insert([
          {
            name: data.name || null,
            phone: data.phone,
            email: data.email || null,
            query_type: data.query_type,
            message: data.message,
          }
        ]);
      
      if (error) throw error;
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      // Reset form
      reset();
      
      // Fetch updated queries
      fetchPreviousQueries(data.phone);
    } catch (error) {
      console.error('Error submitting query:', error);
      toast({
        title: "Error",
        description: "There was an error submitting your query. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
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
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <AppSidebar>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-green-800 mb-2">
              {t.title}
            </h1>
            <p className="text-lg text-gray-600">
              {t.subtitle}
            </p>
            
            {/* Language Selector */}
            <div className="mt-4 flex justify-center">
              <LanguageSelector 
                selectedLanguage={selectedLanguage} 
                onLanguageChange={handleLanguageChange} 
              />
            </div>
          </motion.div>

          {/* Success Message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-100 border border-green-300 text-green-800 rounded-lg p-4 flex items-center justify-center gap-2"
            >
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p>{t.successMessage}</p>
            </motion.div>
          )}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Contact Form */}
            <motion.div variants={itemVariants} className="md:col-span-2">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6" />
                    {t.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        {t.nameLabel}
                      </Label>
                      <Input
                        id="name"
                        {...register('name')}
                        placeholder={t.namePlaceholder}
                        className="h-10"
                      />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        {t.phoneLabel} *
                      </Label>
                      <Input
                        id="phone"
                        {...register('phone')}
                        placeholder={t.phonePlaceholder}
                        className="h-10"
                        onChange={(e) => {
                          register('phone').onChange(e);
                          fetchPreviousQueries(e.target.value);
                        }}
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        {t.emailLabel}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder={t.emailPlaceholder}
                        className="h-10"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Query Type Field */}
                    <div className="space-y-2">
                      <Label htmlFor="query_type" className="text-sm font-medium text-gray-700">
                        {t.queryTypeLabel} *
                      </Label>
                      <Select 
                        defaultValue="Soil Health" 
                        onValueChange={(value) => setValue('query_type', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Soil Health">{t.queryTypes.soilHealth}</SelectItem>
                          <SelectItem value="Crop Issue">{t.queryTypes.cropIssue}</SelectItem>
                          <SelectItem value="Pest Alert">{t.queryTypes.pestAlert}</SelectItem>
                          <SelectItem value="Other">{t.queryTypes.other}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message Field */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                          {t.messageLabel} *
                        </Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={toggleRecording}
                          className={`${isRecording ? 'bg-red-100 text-red-600 border-red-300' : ''}`}
                        >
                          {isRecording ? (
                            <>
                              <MicOff className="h-4 w-4 mr-2" />
                              {t.stopRecording}
                            </>
                          ) : (
                            <>
                              <Mic className="h-4 w-4 mr-2" />
                              {t.voiceInput}
                            </>
                          )}
                        </Button>
                      </div>
                      <Textarea
                        id="message"
                        {...register('message')}
                        placeholder={t.messagePlaceholder}
                        className="min-h-[120px]"
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg font-semibold mt-4"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          {t.submitting}
                        </>
                      ) : (
                        t.submitButton
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar with Previous Queries and Helpline */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Previous Queries */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MessageSquare className="h-5 w-5" />
                    {t.previousQueries}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 max-h-[300px] overflow-y-auto">
                  {previousQueries.length > 0 ? (
                    <div className="space-y-3">
                      {previousQueries.map((query) => (
                        <div key={query.id} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                          <p className="text-sm font-medium text-gray-800">{query.query_type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(query.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-1 text-gray-700 line-clamp-2">{query.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">{t.noQueries}</p>
                  )}
                </CardContent>
              </Card>

              {/* Helpline Numbers */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Phone className="h-5 w-5" />
                    {t.helplineTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {helplineNumbers.map((helpline, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{helpline.region}</span>
                        <Button variant="link" className="text-green-600 p-0 h-auto">
                          {helpline.number}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AppSidebar>
  );
};

export default ContactUs;
