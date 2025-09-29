-- Create storage bucket for soil and water images
INSERT INTO storage.buckets (id, name, public)
VALUES ('soil-images', 'soil-images', true);

-- Create policy to allow anyone to upload images
CREATE POLICY "Allow anyone to upload soil images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'soil-images');

-- Create policy to allow anyone to view images
CREATE POLICY "Allow anyone to view soil images" ON storage.objects
    FOR SELECT USING (bucket_id = 'soil-images');

-- Create policy to allow anyone to update images
CREATE POLICY "Allow anyone to update soil images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'soil-images');

-- Create policy to allow anyone to delete images
CREATE POLICY "Allow anyone to delete soil images" ON storage.objects
    FOR DELETE USING (bucket_id = 'soil-images');
