import React from 'react';
import { Button } from '@/components/ui/button';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Dashboard', href: '#dashboard' },
    { name: 'Soil Health', href: '#soil-health' },
    { name: 'Chatbot', href: '#chatbot' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const resources = [
    { name: 'Knowledge Hub', href: '#blog' },
    { name: 'API Documentation', href: '#docs' },
    { name: 'Help Center', href: '#help' },
    { name: 'Privacy Policy', href: '#privacy' },
    { name: 'Terms of Service', href: '#terms' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-agri-soil text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-hero rounded-lg">
                <Leaf size={20} className="text-white" />
              </div>
              <span className="text-xl font-bold">Krishi Mitra</span>
            </div>
            
            <p className="text-white/80 leading-relaxed">
              Empowering farmers worldwide with AI-driven insights for sustainable 
              and profitable agriculture.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <Mail size={16} />
                <span>contact@agrisense.ai</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <MapPin size={16} />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-white/80 mb-4">
              Get the latest agricultural insights and platform updates.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-agri-green"
                />
                <Button variant="hero" size="sm">
                  Subscribe
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="flex items-center justify-center w-10 h-10 bg-white/10 rounded-xl hover:bg-agri-green transition-colors"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-white/20 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60">
              © 2024 Krishi Mitra. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/60">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};