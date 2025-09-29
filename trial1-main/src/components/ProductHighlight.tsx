import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';
import productShowcase from '@/assets/product-showcase.jpg';

export const ProductHighlight = () => {
  const benefits = [
    'Real-time crop monitoring',
    'AI-powered pest detection',
    'Soil health analysis',
    'Weather predictions',
    'Market price insights'
  ];

  return (
    <section className="py-20 bg-gradient-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-agri-hero">
              <img 
                src={productShowcase} 
                alt="Agricultural products showcase" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-agri-green/20 to-transparent"></div>
            </div>
            
            {/* Floating card */}
            <div className="absolute -bottom-6 -right-6 bg-card p-6 rounded-2xl shadow-agri-card">
              <div className="text-2xl font-bold text-agri-green">98%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Advanced Agricultural Intelligence Platform
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our comprehensive Krishi Mitra platform combines cutting-edge technology 
                with agricultural expertise to help farmers make informed decisions and 
                maximize their crop yields.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle size={20} className="text-agri-green flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="agri" size="lg">
                Learn More
                <ArrowRight size={18} />
              </Button>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};