import React from 'react';

export const TrustedPartners = () => {
  const partners = [
    'TechCorp',
    'AgriTech Solutions',
    'FarmWise',
    'CropScience',
    'GreenTech',
    'SmartFarm'
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Trusted by Top Companies
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="flex items-center justify-center p-4 bg-card rounded-xl shadow-agri-card hover:shadow-agri-button transition-all duration-300 hover:scale-105"
            >
              <span className="text-lg font-bold text-muted-foreground/60 hover:text-agri-green transition-colors">
                {partner}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};