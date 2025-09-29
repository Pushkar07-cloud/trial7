import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Home, 
  Droplets, 
  Eye, 
  AlertTriangle, 
  FileText, 
  Menu, 
  X,
  Leaf
} from 'lucide-react';

interface AppSidebarProps {
  children: React.ReactNode;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { 
      id: 'home', 
      label: 'Back to Home', 
      icon: Home, 
      path: '/dashboard' 
    },
    { 
      id: 'soil-health', 
      label: 'Soil Health', 
      icon: Droplets, 
      path: '/dashboard/soil-health' 
    },
    { 
      id: 'crop-monitoring', 
      label: 'Crop Monitoring', 
      icon: Eye, 
      path: '/dashboard/crop-monitoring' 
    },
    { 
      id: 'pest-alerts', 
      label: 'Pest Alerts', 
      icon: AlertTriangle, 
      path: '/dashboard/pest-alerts' 
    },
    { 
      id: 'reports', 
      label: 'Reports', 
      icon: FileText, 
      path: '/dashboard/reports' 
    }
  ];

  const handleNavigation = (path: string) => {
    if (path === '/dashboard') {
      // If clicking Home in dashboard, go to main website home
      navigate('/');
    } else {
      navigate(path);
    }
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    // "Back to Home" should never be active in dashboard
    if (path === '/dashboard') {
      return false;
    }
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-green-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div>
              <h1 className="text-xl font-bold text-green-800">Krishi Mitra</h1>
              <p className="text-sm text-gray-600">Farm Management</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }} // easeInOut cubic-bezier curve
            onClick={() => handleNavigation(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-green-100 text-green-800 border border-green-200 shadow-sm'
                : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.label}</span>
            {isActive(item.path) && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-2 h-2 bg-green-600 rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
            )}
          </motion.button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-200">
        <p className="text-xs text-gray-500 text-center">
          Krishi Mitra v1.0
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white shadow-lg border-r border-green-200">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex items-center justify-between p-4 border-b border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-green-800">Krishi Mitra</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppSidebar;
