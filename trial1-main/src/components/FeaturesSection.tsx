import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Activity, Eye, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useChatSidebar } from './GlobalChatSidebar';
import AgriculturalIcons from '@/components/AgriculturalIcons';

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const { closeSidebar } = useChatSidebar();
  
  const features = [
    {
      icon: Activity,
      title: 'Soil Health Analysis',
      description: 'Get detailed analysis of your soil composition, pH levels, and nutrient content with AI-powered recommendations for optimal crop growth.',
      color: 'green'
    },
    {
      icon: Eye,
      title: 'Crop Monitoring',
      description: 'Monitor your crops in real-time using satellite imagery and AI detection to identify growth patterns and potential issues early.',
      color: 'blue'
    },
    {
      icon: AlertTriangle,
      title: 'Pest & Disease Alerts',
      description: 'Receive instant notifications about pest and disease risks in your area with preventive measures and treatment suggestions.',
      color: 'orange'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
            🌾 Smart Agriculture Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Leverage the power of AI to transform your farming practices with intelligent insights and real-time monitoring designed for Indian farmers.
          </p>
          
          {/* Agricultural Icons */}
          <div className="flex justify-center gap-6 mt-8">
            <AgriculturalIcons type="soil" size="lg" />
            <AgriculturalIcons type="crops" size="lg" />
            <AgriculturalIcons type="growth" size="lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-green-100 h-full">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  feature.color === 'green' ? 'bg-green-100' :
                  feature.color === 'blue' ? 'bg-blue-100' : 'bg-orange-100'
                }`}>
                  <feature.icon className={`h-8 w-8 ${
                    feature.color === 'green' ? 'text-green-600' :
                    feature.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">
              🌱 Ready to Transform Your Farming?
            </h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get instant AI-powered soil analysis, personalized recommendations, and expert guidance for your farm.
            </p>
            
            {/* Agricultural Icons in CTA */}
            <div className="flex justify-center gap-4 mb-8">
              <AgriculturalIcons type="soil" size="md" />
              <AgriculturalIcons type="water" size="md" />
              <AgriculturalIcons type="sun" size="md" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                onClick={() => {
                  closeSidebar();
                  navigate('/soil-data');
                }}
              >
                <Activity className="mr-2 h-5 w-5" />
                Start Soil Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700 text-lg px-8 py-4 font-semibold"
                onClick={() => {
                  closeSidebar();
                  navigate('/evaluation-results');
                }}
              >
                View Sample Results
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-green hover:bg-white hover:text-green-700 text-lg px-8 py-4 font-semibold"
                onClick={() => {
                  closeSidebar();
                  navigate('/dashboard');
                }}
              >
                Open Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
