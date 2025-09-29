import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sprout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatSidebar } from '@/components/GlobalChatSidebar';

// Import farmer images from assets
import farmerImage1 from '@/assets/1.jpeg';
import farmerImage2 from '@/assets/2.jpeg';
import farmerImage3 from '@/assets/3.jpeg';
import farmerImage4 from '@/assets/4.jpeg';
import farmerLogo from '@/assets/farmer-mobile-logo.svg';

export const HeroSection = () => {
  const navigate = useNavigate();
  const { closeSidebar } = useChatSidebar();

  const handleNavigation = (path: string) => {
    closeSidebar();
    navigate(path);
  };

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
          {/* Left side content */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <div className="flex items-center mb-4">
              <img 
                src={farmerLogo} 
                alt="Krishi Mitra Logo" 
                className="h-12 w-12 sm:h-16 sm:w-16 mr-3 sm:mr-4"
              />
              <h1 className="text-3xl sm:text-4xl font-bold text-green-600">Krishi Mitra</h1>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-4 sm:mb-6">
              Your AI-Powered Farming Companion
            </h2>
            
            <p className="text-sm sm:text-base text-gray-700 mb-6 sm:mb-8 max-w-lg">
              Get instant soil analysis, AI-powered recommendations, and personalized farming guidance. Transform your agricultural practices with cutting-edge technology designed for Indian farmers.
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button 
                variant="default" 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 text-sm sm:text-base"
                onClick={() => handleNavigation('/dashboard/soil-health')}
              >
                <Sprout className="h-4 w-4 sm:h-5 sm:w-5" />
                Start Soil Analysis
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
              </Button>
              
              <Button 
                variant="outline" 
                className="border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base"
                onClick={() => handleNavigation('/dashboard')}
              >
                View Dashboard
              </Button>
            </div>
          </div>
          
          {/* Right side images */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 md:gap-4">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img 
                src={farmerImage1} 
                alt="Indian farmer" 
                className="w-full h-36 sm:h-40 md:h-48 object-cover"
              />
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img 
                src={farmerImage2} 
                alt="Indian farmer" 
                className="w-full h-36 sm:h-40 md:h-48 object-cover"
              />
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img 
                src={farmerImage3} 
                alt="Indian farmer" 
                className="w-full h-36 sm:h-40 md:h-48 object-cover"
              />
            </div>
            
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img 
                src={farmerImage4} 
                alt="Indian farmer" 
                className="w-full h-36 sm:h-40 md:h-48 object-cover"
              />
            </div>
          </div>
        </div>
        
        {/* Stats section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 bg-green-50 rounded-xl p-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600">5000+</div>
            <div className="text-sm md:text-base text-gray-600">Farmers Helped</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600">800+</div>
            <div className="text-sm md:text-base text-gray-600">Hectares Monitored</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-green-600">15+</div>
            <div className="text-sm md:text-base text-gray-600">States Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
};