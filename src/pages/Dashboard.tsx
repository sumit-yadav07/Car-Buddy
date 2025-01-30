import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import { Car, LogOut, Plus, Search } from 'lucide-react';
import CarList from '../components/CarList';
import type { Car as CarType, Profile } from '../lib/supabase';


export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cars, setCars] = useState<CarType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  

  useEffect(() => {
    fetchProfile();
    fetchCars();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        navigate('/');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchCars = async () => {
    try {
      const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      navigate('/');
      return;
    }

      const { data, error } = await supabase
        .from('cars')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCars(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCars(cars.filter(car => car.id !== id));
      toast.success('Car deleted successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredCars = cars.filter(car => {
    const searchLower = searchQuery.toLowerCase();
    return (
      car.title.toLowerCase().includes(searchLower) ||
      car.description.toLowerCase().includes(searchLower) ||
      car.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Car className="h-12 w-12 text-blue-600 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {profile?.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/cars/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Car
              </Link>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {filteredCars.length === 0 ? (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new car.
            </p>
          </div>
        ) : (
          <CarList cars={filteredCars} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
}