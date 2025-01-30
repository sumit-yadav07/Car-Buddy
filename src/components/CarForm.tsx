import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Car } from '../lib/supabase';

type CarFormProps = {
  car?: Car;
  onCancel: () => void;
};

export default function CarForm({ car, onCancel }: CarFormProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(car?.title || '');
  const [description, setDescription] = useState(car?.description || '');
  const [tags, setTags] = useState<string[]>(car?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(car?.images || []);

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + previewUrls.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setImages([...images, ...files]);
    
    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('No user found');

      // Upload images
      const imageUrls = [...car?.images || []];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from('car-images')
          .upload(fileName, image);
        
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('car-images')
          .getPublicUrl(data.path);
        
        imageUrls.push(publicUrl);
      }

      const carData = {
        title,
        description,
        tags,
        images: imageUrls,
        user_id: user.id,
      };

      if (car) {
        const { error } = await supabase
          .from('cars')
          .update(carData)
          .eq('id', car.id);
        if (error) throw error;
        toast.success('Car updated successfully!');
      } else {
        const { error } = await supabase
          .from('cars')
          .insert([carData]);
        if (error) throw error;
        toast.success('Car added successfully!');
      }

      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tags</label>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          placeholder="Type and press Enter to add tags"
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 inline-flex items-center"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 grid grid-cols-5 gap-4">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-24 w-24 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : car ? 'Update Car' : 'Add Car'}
        </button>
      </div>
    </form>
  );
}