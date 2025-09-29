-- Create comprehensive agriculture tables for the React app

-- Drop existing soil_data table if it exists and recreate with proper structure
DROP TABLE IF EXISTS public.soil_data CASCADE;

-- Create soil_data table
CREATE TABLE public.soil_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    moisture DECIMAL(5,2) NOT NULL CHECK (moisture >= 0 AND moisture <= 100),
    ph DECIMAL(3,1) NOT NULL CHECK (ph >= 0 AND ph <= 14),
    nitrogen DECIMAL(6,2) NOT NULL CHECK (nitrogen >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create crop_data table
CREATE TABLE public.crop_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    crop_type VARCHAR(100) NOT NULL,
    growth_stage VARCHAR(50) NOT NULL,
    yield_potential DECIMAL(5,2) NOT NULL CHECK (yield_potential >= 0 AND yield_potential <= 100),
    field_location VARCHAR(100),
    planting_date DATE,
    expected_harvest DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pest_alerts table
CREATE TABLE public.pest_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    alert_type VARCHAR(100) NOT NULL,
    field VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    description TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'investigating')),
    reported_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create history table for tracking all operations
CREATE TABLE public.history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_soil_data_created_at ON public.soil_data(created_at DESC);
CREATE INDEX idx_crop_data_created_at ON public.crop_data(created_at DESC);
CREATE INDEX idx_pest_alerts_created_at ON public.pest_alerts(created_at DESC);
CREATE INDEX idx_pest_alerts_severity ON public.pest_alerts(severity);
CREATE INDEX idx_pest_alerts_status ON public.pest_alerts(status);
CREATE INDEX idx_history_table_record ON public.history(table_name, record_id);
CREATE INDEX idx_history_created_at ON public.history(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.soil_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pest_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (for demo purposes)
CREATE POLICY "Allow public access to soil_data" ON public.soil_data FOR ALL USING (true);
CREATE POLICY "Allow public access to crop_data" ON public.crop_data FOR ALL USING (true);
CREATE POLICY "Allow public access to pest_alerts" ON public.pest_alerts FOR ALL USING (true);
CREATE POLICY "Allow public access to history" ON public.history FOR ALL USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_soil_data_updated_at 
    BEFORE UPDATE ON public.soil_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crop_data_updated_at 
    BEFORE UPDATE ON public.crop_data 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pest_alerts_updated_at 
    BEFORE UPDATE ON public.pest_alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to log history
CREATE OR REPLACE FUNCTION log_history()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO public.history (table_name, record_id, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), 'system');
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.history (table_name, record_id, operation, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), 'system');
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO public.history (table_name, record_id, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), 'system');
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for history logging
CREATE TRIGGER soil_data_history_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.soil_data
    FOR EACH ROW EXECUTE FUNCTION log_history();

CREATE TRIGGER crop_data_history_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.crop_data
    FOR EACH ROW EXECUTE FUNCTION log_history();

CREATE TRIGGER pest_alerts_history_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.pest_alerts
    FOR EACH ROW EXECUTE FUNCTION log_history();

-- Insert sample data
INSERT INTO public.soil_data (moisture, ph, nitrogen, notes) VALUES
(72.5, 6.8, 85.2, 'Field A - Wheat crop'),
(68.3, 7.1, 78.9, 'Field B - Corn crop'),
(75.1, 6.5, 92.3, 'Field C - Rice crop'),
(70.8, 6.9, 81.7, 'Field A - Follow up measurement');

INSERT INTO public.crop_data (crop_type, growth_stage, yield_potential, field_location, planting_date, expected_harvest) VALUES
('Wheat', 'Flowering', 85.5, 'Field A', '2024-10-15', '2025-03-20'),
('Corn', 'Vegetative', 78.2, 'Field B', '2024-11-01', '2025-04-15'),
('Rice', 'Tillering', 92.1, 'Field C', '2024-09-20', '2025-02-28'),
('Soybean', 'Podding', 88.7, 'Field D', '2024-10-05', '2025-03-10');

INSERT INTO public.pest_alerts (alert_type, field, severity, description, reported_by) VALUES
('Aphids', 'Field A', 'low', 'Small population detected on wheat leaves', 'John Smith'),
('Fungal Infection', 'Field B', 'medium', 'Powdery mildew spreading in corn field', 'Jane Doe'),
('Leaf Spot', 'Field C', 'high', 'Severe leaf spot disease affecting rice crop', 'Mike Johnson'),
('Root Rot', 'Field D', 'medium', 'Early signs of root rot in soybean field', 'Sarah Wilson');
