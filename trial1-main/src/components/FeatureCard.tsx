import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  className = '' 
}) => {
  return (
    <div className={`bg-card rounded-2xl p-8 shadow-agri-card hover:shadow-agri-hero transition-all duration-300 hover:scale-105 group ${className}`}>
      <div className="flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-2xl mb-6 group-hover:scale-110 transition-transform">
        <Icon size={28} className="text-white" />
      </div>
      
      <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-agri-green transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
};