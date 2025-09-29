-- Create evaluation_results table for storing soil evaluation results and email addresses
CREATE TABLE IF NOT EXISTS public.evaluation_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    soil_data JSONB NOT NULL,
    evaluation_results JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email for faster queries
CREATE INDEX IF NOT EXISTS idx_evaluation_results_email ON public.evaluation_results(email);

-- Create index for created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_evaluation_results_created_at ON public.evaluation_results(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.evaluation_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert evaluation results
CREATE POLICY "Allow anyone to insert evaluation results" ON public.evaluation_results
    FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read evaluation results
CREATE POLICY "Allow anyone to read evaluation results" ON public.evaluation_results
    FOR SELECT USING (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_evaluation_results_updated_at 
    BEFORE UPDATE ON public.evaluation_results 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
