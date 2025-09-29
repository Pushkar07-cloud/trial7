import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = localStorage.getItem('theme') || 'light';
    setIsDark(initialTheme === 'dark');
    root.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    const root = window.document.documentElement;
    const newTheme = isDark ? 'light' : 'dark';
    
    setIsDark(!isDark);
    root.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', newTheme);
    
    // Reset animation state after animation completes
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      disabled={isAnimating}
      aria-label="Toggle theme"
      className={`relative overflow-hidden transition-all duration-300 ${isDark ? 
        'bg-gray-800 border-primary/40 hover:border-primary/70 hover:bg-gray-700' : 
        'bg-white border-primary/20 hover:border-primary/50 hover:bg-gray-50'}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            backgroundColor: isDark ? 'rgba(20, 184, 100, 0.15)' : 'rgba(255, 255, 255, 0)',
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -30 }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          rotate: 0,
        }}
        exit={{ scale: 0.5, opacity: 0, rotate: 30 }}
        transition={{ 
          duration: 0.4,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
        key={isDark ? 'dark' : 'light'}
        className="relative z-10"
      >
        {isDark ? (
          <Sun size={18} className="text-yellow-400 filter drop-shadow-md" />
        ) : (
          <Moon size={18} className="text-primary filter drop-shadow-sm" />
        )}
      </motion.div>
    </Button>
  );
};