import React from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { TrustedPartners } from '@/components/TrustedPartners';
import { FeaturesSection } from '@/components/FeaturesSection';
import { ProductHighlight } from '@/components/ProductHighlight';
import { StatsSection } from '@/components/StatsSection';
import { BlogSection } from '@/components/BlogSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trusted Partners */}
      <TrustedPartners />
      
      {/* Features */}
      <FeaturesSection />
      
      {/* Product Highlight */}
      <ProductHighlight />
      
      {/* Stats */}
      <StatsSection />
      
      {/* Blog/Knowledge */}
      <BlogSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
