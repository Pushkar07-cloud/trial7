import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

interface LanguageSelectorProps {
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage: propSelectedLanguage,
  onLanguageChange,
}) => {
  const [internalSelectedLanguage, setInternalSelectedLanguage] = useState(languages[0]);
  
  const selectedLanguage = propSelectedLanguage 
    ? languages.find(lang => lang.code === propSelectedLanguage) || languages[0]
    : internalSelectedLanguage;

  const handleLanguageChange = (language: typeof languages[0]) => {
    if (onLanguageChange) {
      onLanguageChange(language.code);
    } else {
      setInternalSelectedLanguage(language);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe size={16} />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">{selectedLanguage.name}</span>
          <ChevronDown size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center gap-2"
          >
            <span>{language.flag}</span>
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};