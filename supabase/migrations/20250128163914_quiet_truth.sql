/*
  # Create storage bucket for car images

  1. New Storage Bucket
    - Name: car-images
    - Public access enabled
    - File size limit: 5MB
    - Allowed MIME types: image/*
  2. Security
    - Enable public access for authenticated users
    - Add policies for CRUD operations
*/

-- Create the storage bucket for car images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'car-images',
  'car-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
);

-- Enable storage policies
CREATE POLICY "Authenticated users can upload car images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their car images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'car-images' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view car images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can delete their car images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'car-images' AND auth.role() = 'authenticated' AND (storage.foldername(name))[1] = auth.uid()::text);