# Soil Data Input Feature

## Overview
The Soil Data Input feature allows farmers to easily collect and submit soil and water analysis data through a user-friendly web form. The data is stored in Supabase and can be used for AI-powered agricultural recommendations.

## Features

### Form Fields
- **Farmer ID**: Simple text input for farmer identification
- **Soil Moisture**: Percentage input (0-100%)
- **Soil pH**: pH level input (0-14)
- **NPK Nutrients**: Separate inputs for Nitrogen, Phosphorus, and Potassium
- **Weather Condition**: Dropdown with options (Sunny, Rainy, Cloudy)
- **Image Upload**: Support for both soil and water sample photos
- **Notes**: Optional text area for additional observations

### Design Features
- **Farmer-Friendly**: Large buttons, clear icons, and simple language
- **Mobile Optimized**: Works well on phones and tablets for field use
- **Visual Icons**: Each input has a relevant icon for easy identification
- **Green Theme**: Clean green/white color scheme matching agricultural context
- **Form Validation**: Real-time validation with helpful error messages

## Database Schema

### Table: `soil_data`
```sql
CREATE TABLE soil_data (
    id UUID PRIMARY KEY,
    farmer_id TEXT NOT NULL,
    soil_moisture DECIMAL(5,2) NOT NULL,
    soil_ph DECIMAL(3,1) NOT NULL,
    nitrogen DECIMAL(6,2) NOT NULL,
    phosphorus DECIMAL(6,2) NOT NULL,
    potassium DECIMAL(6,2) NOT NULL,
    weather_condition TEXT NOT NULL,
    soil_image_url TEXT,
    water_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage: `soil-images` bucket
- Public bucket for storing uploaded images
- Automatic URL generation for uploaded files
- 5MB file size limit per image

## Usage

### Navigation
- Access via main navigation menu: "Soil Data"
- Direct URL: `/soil-data`
- Call-to-action button on the main features section

### Form Submission
1. Fill in required fields (Farmer ID, soil measurements, weather)
2. Optionally upload soil and/or water sample photos
3. Add any additional notes
4. Click "Evaluate My Soil" button
5. Form validates and submits data to Supabase
6. Success/error messages are displayed

### Data Validation
- Soil moisture: 0-100%
- Soil pH: 0-14
- NPK values: Must be positive numbers
- Weather condition: Must be one of the predefined options
- Image files: Maximum 5MB, image formats only

## Technical Implementation

### Frontend
- React with TypeScript
- React Hook Form with Zod validation
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui components

### Backend
- Supabase for database and file storage
- Row Level Security (RLS) enabled
- Public policies for farmer-friendly access
- Automatic timestamp updates

### Security
- All data is publicly accessible (suitable for demo/development)
- File upload size limits
- Input validation on both client and server
- SQL injection protection via Supabase

## Future Enhancements
- User authentication system
- Farmer-specific data access
- AI analysis integration
- Historical data visualization
- Export functionality
- Bulk data import
- Mobile app integration

## Setup Instructions

1. Ensure Supabase is configured with the provided migrations
2. Run the migrations to create the database schema
3. Start the development server: `npm run dev`
4. Navigate to `/soil-data` to access the form

## Files Modified/Created
- `src/pages/SoilDataInput.tsx` - Main form component
- `src/App.tsx` - Added route
- `src/components/Navigation.tsx` - Added navigation link
- `src/components/FeaturesSection.tsx` - Added call-to-action
- `src/integrations/supabase/types.ts` - Updated with soil_data table types
- `supabase/migrations/20250117000000_create_soil_data_table.sql` - Database schema
- `supabase/migrations/20250117000001_create_soil_images_storage.sql` - Storage bucket setup
