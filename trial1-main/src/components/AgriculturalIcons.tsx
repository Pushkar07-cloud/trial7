import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Sprout, 
  Wheat, 
  TreePine,
  Flower2,
  Bug
} from 'lucide-react';

interface AgriculturalIconsProps {
  className?: string;
  style?: React.CSSProperties;
  type?: 'soil' | 'crops' | 'nature' | 'water' | 'sun' | 'growth';
  size?: 'sm' | 'md' | 'lg';
}

const AgriculturalIcons: React.FC<AgriculturalIconsProps> = ({ 
  className = "", 
  style = {},
  type = 'soil',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconVariants = {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      rotate: -10
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3
      }
    }
  };

  const floatVariants = {
    float: {
      y: [-3, 3, -3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const renderSoilIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(180, 83, 9, 0.3)'
        }}
      >
        <Leaf className="w-6 h-6 text-amber-100" />
      </motion.div>
      {/* Soil particles */}
      <motion.div
        className="absolute -top-1 -left-1 w-2 h-2 bg-amber-500 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.5 }}
      />
      <motion.div
        className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-400 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.8 }}
      />
    </motion.div>
  );

  const renderCropsIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)'
        }}
      >
        <Sprout className="w-6 h-6 text-green-100" />
      </motion.div>
      {/* Rice grains */}
      <motion.div
        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-yellow-300 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.3 }}
      />
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-yellow-200 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.6 }}
      />
    </motion.div>
  );

  const renderNatureIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
        }}
      >
        <TreePine className="w-6 h-6 text-emerald-100" />
      </motion.div>
      {/* Leaves */}
      <motion.div
        className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.4 }}
      />
      <motion.div
        className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-green-300 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.7 }}
      />
    </motion.div>
  );

  const renderWaterIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
        }}
      >
        <Droplets className="w-6 h-6 text-blue-100" />
      </motion.div>
      {/* Water drops */}
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-blue-300 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.2 }}
      />
    </motion.div>
  );

  const renderSunIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)'
        }}
      >
        <Sun className="w-6 h-6 text-yellow-100" />
      </motion.div>
      {/* Sun rays */}
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-300 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.1 }}
      />
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-3 bg-yellow-200 rounded-full rotate-45"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.3 }}
      />
    </motion.div>
  );

  const renderGrowthIcon = () => (
    <motion.div
      className="relative"
      variants={iconVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-b from-lime-500 to-lime-700 rounded-full flex items-center justify-center shadow-lg`}
        variants={floatVariants}
        animate="float"
        style={{
          boxShadow: '0 4px 15px rgba(132, 204, 22, 0.3)'
        }}
      >
        <Wheat className="w-6 h-6 text-lime-100" />
      </motion.div>
      {/* Growth indicators */}
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-lime-300 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-lime-200 rounded-full"
        variants={floatVariants}
        animate="float"
        transition={{ delay: 0.5 }}
      />
    </motion.div>
  );

  const renderContent = () => {
    switch (type) {
      case 'crops':
        return renderCropsIcon();
      case 'nature':
        return renderNatureIcon();
      case 'water':
        return renderWaterIcon();
      case 'sun':
        return renderSunIcon();
      case 'growth':
        return renderGrowthIcon();
      default:
        return renderSoilIcon();
    }
  };

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`} style={style}>
      {renderContent()}
    </div>
  );
};

export default AgriculturalIcons;
