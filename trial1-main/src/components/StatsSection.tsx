import React from 'react';
import { Users, MapPin, Globe } from 'lucide-react';

export const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      value: '5000+',
      label: 'Farmers Helped',
      description: 'Active users benefiting from AI insights'
    },
    {
      icon: MapPin,
      value: '800+',
      label: 'Hectares Monitored',
      description: 'Agricultural land under smart monitoring'
    },
    {
      icon: Globe,
      value: '15+',
      label: 'Countries Supported',
      description: 'Global reach across continents'
    }
  ];

  return (
    <section className="py-20 bg-agri-green text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transforming Agriculture Worldwide
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join thousands of farmers who are already revolutionizing their agricultural practices with Krishi Mitra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center w-20 h-20 bg-white/10 rounded-3xl mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                <stat.icon size={32} className="text-white" />
              </div>
              
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              
              <div className="text-xl font-semibold mb-2">
                {stat.label}
              </div>
              
              <div className="text-white/70">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};