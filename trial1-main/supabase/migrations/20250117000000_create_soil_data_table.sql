-- Create soil_data table for storing farmer soil and water analysis data
CREATE TABLE IF NOT EXISTS public.soil_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    farmer_id TEXT NOT NULL, -- Simple farmer identifier for tracking
    soil_moisture DECIMAL(5,2) NOT NULL CHECK (soil_moisture >= 0 AND soil_moisture <= 100),
    soil_ph DECIMAL(3,1) NOT NULL CHECK (soil_ph >= 0 AND soil_ph <= 14),
    nitrogen DECIMAL(6,2) NOT NULL CHECK (nitrogen >= 0),
    phosphorus DECIMAL(6,2) NOT NULL CHECK (phosphorus >= 0),
    potassium DECIMAL(6,2) NOT NULL CHECK (potassium >= 0),
    weather_condition TEXT NOT NULL CHECK (weather_condition IN ('Sunny', 'Rainy', 'Cloudy')),
    soil_image_url TEXT,
    water_image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for farmer_id for faster queries
CREATE INDEX IF NOT EXISTS idx_soil_data_farmer_id ON public.soil_data(farmer_id);

-- Create index for created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_soil_data_created_at ON public.soil_data(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.soil_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert soil data (for farmer-friendly access)
CREATE POLICY "Allow anyone to insert soil data" ON public.soil_data
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read soil data (for farmer access)
CREATE POLICY "Allow anyone to read soil data" ON public.soil_data
    FOR SELECT USING (true);

-- Create policy to allow updates by anyone (for farmer updates)
CREATE POLICY "Allow anyone to update soil data" ON public.soil_data
    FOR UPDATE USING (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_soil_data_updated_at 
    BEFORE UPDATE ON public.soil_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
