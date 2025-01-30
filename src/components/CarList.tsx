import { Link } from 'react-router-dom';
import type { Car } from '../lib/supabase';

type CarListProps = {
  cars: Car[];
  onDelete: (id: string) => void;
};

export default function CarList({ cars, onDelete }: CarListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            <img
              src={car.images[0] || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500'}
              alt={car.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-semibold text-lg">{car.title}</h3>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-600 line-clamp-2 mb-4">{car.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {car.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <Link
                to={`/cars/${car.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details
              </Link>
              <button
                onClick={() => onDelete(car.id)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}