import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Car as CarIcon, ArrowLeft, Edit } from 'lucide-react';
import CarForm from '../components/CarForm';
import type { Car } from '../lib/supabase';

export default function CarDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [car, setCar] = useState<Car | null>(null);
  const [editing, setEditing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCar(data);
    } catch (error: any) {
      toast.error(error.message);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <CarIcon className="h-12 w-12 text-blue-600 animate-bounce" />
      </div>
    );
  }

  if (!car) return null;

  if (editing) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-8">Edit Car</h2>
          <CarForm car={car} onCancel={() => setEditing(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96">
            {car.images.length > 0 ? (
              <>
                <img
                  src={car.images[currentImageIndex]}
                  alt={car.title}
                  className="w-full h-full object-cover"
                />
                {car.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {car.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex
                            ? 'bg-white'
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <CarIcon className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{car.title}</h1>
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-5 w-5 mr-2" />
                Edit
              </button>
            </div>

            <p className="text-gray-600 text-lg mb-6">{car.description}</p>

            <div className="flex flex-wrap gap-2">
              {car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}