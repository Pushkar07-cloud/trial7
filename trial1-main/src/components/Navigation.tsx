import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Home, LayoutDashboard, Sprout, Database, MessageCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatSidebar } from './GlobalChatSidebar';
import { motion } from 'framer-motion';
import farmerLogo from '../assets/farmer-mobile-logo.svg';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { openSidebar, closeSidebar } = useChatSidebar();

  const menuItems = [
    { name: 'Home', href: '/', action: 'navigate', icon: 'Home' },
    { name: 'Dashboard', href: '/dashboard', action: 'navigate', icon: 'LayoutDashboard' },
    { name: 'Soil Health', href: '/dashboard/soil-health', action: 'navigate', icon: 'Sprout' },
    { name: 'Soil Data', href: '/soil-data', action: 'navigate', icon: 'Database' },
    { name: 'Chatbot', href: '/chatbot', action: 'sidebar', icon: 'MessageCircle' },
    { name: 'Contact', href: '/contactus', action: 'navigate', icon: 'Phone' },
  ];

  return (
    <nav className="bg-background/95 dark:bg-background/80 backdrop-blur-sm border-b border-border dark:border-border/50 sticky top-0 z-50 shadow-sm dark:shadow-green-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center justify-center w-10 h-10 relative">
              <img src={farmerLogo} alt="Farmers with mobile phones" className="w-full h-full drop-shadow-md dark:drop-shadow-[0_2px_4px_rgba(0,255,0,0.2)]" />
              <motion.div 
                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 dark:bg-green-300 rounded-full shadow-md dark:shadow-green-300/50" 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 dark:from-green-300 dark:to-green-100 drop-shadow-sm dark:drop-shadow-[0_1px_2px_rgba(0,255,0,0.15)]">
              Krishi Mitra
            </span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (item.action === 'navigate') {
                      closeSidebar(); // Close sidebar when navigating to other pages
                      navigate(item.href);
                    } else if (item.action === 'sidebar') {
                      openSidebar();
                    } else {
                      closeSidebar(); // Close sidebar when scrolling to sections
                      window.location.href = item.href;
                    }
                  }}
                  className="transition-all duration-200 hover:scale-105 flex items-center gap-2 dark:hover:bg-primary/10 dark:hover:text-primary-foreground dark:focus:ring-1 dark:focus:ring-primary/30"
                >
                  {item.icon === 'Home' && <Home className="h-4 w-4" />}
                  {item.icon === 'LayoutDashboard' && <LayoutDashboard className="h-4 w-4" />}
                  {item.icon === 'Sprout' && <Sprout className="h-4 w-4" />}
                  {item.icon === 'Database' && <Database className="h-4 w-4" />}
                  {item.icon === 'MessageCircle' && <MessageCircle className="h-4 w-4" />}
                  {item.icon === 'Phone' && <Phone className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="agri" size="sm" className="hidden sm:inline-flex dark:shadow-green-500/20 dark:hover:shadow-green-400/30 transition-all duration-300">
              Login
            </Button>
            
            {/* Mobile menu button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden relative overflow-hidden border-primary/20 hover:border-primary/50 dark:border-primary/30 dark:hover:border-primary/60 transition-all duration-300 dark:bg-background/50 dark:hover:bg-background/70 dark:shadow-inner"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.2 }}
                key={isMenuOpen ? 'close' : 'open'}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-2 bg-card dark:bg-gray-800 rounded-b-xl shadow-agri-card">
              {menuItems.map((item) => (
                <Button
                    key={item.name}
                    variant="ghost"
                    className="w-full justify-start gap-3 py-3"
                    onClick={() => {
                    setIsMenuOpen(false);
                    if (item.action === 'navigate') {
                      closeSidebar(); // Close sidebar when navigating to other pages
                      navigate(item.href);
                    } else if (item.action === 'sidebar') {
                      openSidebar();
                    } else {
                      closeSidebar(); // Close sidebar when scrolling to sections
                      window.location.href = item.href;
                    }
                  }}
                >
                  {item.icon === 'Home' && <Home className="h-5 w-5" />}
                  {item.icon === 'LayoutDashboard' && <LayoutDashboard className="h-5 w-5" />}
                  {item.icon === 'Sprout' && <Sprout className="h-5 w-5" />}
                  {item.icon === 'Database' && <Database className="h-5 w-5" />}
                  {item.icon === 'MessageCircle' && <MessageCircle className="h-5 w-5" />}
                  {item.icon === 'Phone' && <Phone className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Button>
              ))}
              <div className="pt-2">
                <Button variant="agri" className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};