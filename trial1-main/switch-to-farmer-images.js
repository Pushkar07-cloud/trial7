// Script to switch to your Indian farmer images
// Run this after uploading your farmer images to /src/assets/

const fs = require('fs');
const path = require('path');

const heroSectionPath = './src/components/HeroSection.tsx';
const testimonialsPath = './src/components/TestimonialsSection.tsx';

// Read the current HeroSection file
let heroContent = fs.readFileSync(heroSectionPath, 'utf8');

// Uncomment the farmer image imports
heroContent = heroContent.replace(
  /\/\/ import farmer(\d) from '@/assets\/farmer-\d\.jpg';/g,
  "import farmer$1 from '@/assets/farmer-$1.jpg';"
);

// Update the image sources in the background grid
heroContent = heroContent.replace(
  /src={farmerTestimonial1}/g,
  'src={farmer1}'
);
heroContent = heroContent.replace(
  /src={farmerTestimonial2}/g,
  'src={farmer2}'
);
heroContent = heroContent.replace(
  /src={heroFarmerTech}/g,
  'src={farmer3}'
);
heroContent = heroContent.replace(
  /src={heroFields}/g,
  'src={farmer4}'
);
heroContent = heroContent.replace(
  /src={heroResearch}/g,
  'src={farmer5}'
);
heroContent = heroContent.replace(
  /src={heroIot}/g,
  'src={farmer6}'
);

// Write the updated HeroSection
fs.writeFileSync(heroSectionPath, heroContent);

// Read the current TestimonialsSection file
let testimonialsContent = fs.readFileSync(testimonialsPath, 'utf8');

// Update testimonials to use farmer images
testimonialsContent = testimonialsContent.replace(
  /import farmerTestimonial1 from '@/assets\/farmer-testimonial-1\.jpg';/g,
  "import farmer1 from '@/assets/farmer-1.jpg';"
);
testimonialsContent = testimonialsContent.replace(
  /import farmerTestimonial2 from '@/assets\/farmer-testimonial-2\.jpg';/g,
  "import farmer2 from '@/assets/farmer-2.jpg';"
);
testimonialsContent = testimonialsContent.replace(
  /image: farmerTestimonial1/g,
  'image: farmer1'
);
testimonialsContent = testimonialsContent.replace(
  /image: farmerTestimonial2/g,
  'image: farmer2'
);

// Write the updated TestimonialsSection
fs.writeFileSync(testimonialsPath, testimonialsContent);

console.log('✅ Successfully switched to your Indian farmer images!');
console.log('🌾 Your farmer photos are now displayed in the homepage background and testimonials.');
