import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

const HeroSection = () => {
  const [zipCode, setZipCode] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const filters = [
    'All Procedures',
    'Accepts Insurance',
    'Same Day Available',
    'Free Consultation'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching with zip:', zipCode, 'filters:', selectedFilters);
  };

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO: Implement reverse geocoding to get ZIP code
          console.log('Location:', position.coords);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAyNGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find Trusted Dental Implant Providers Near You
          </h1>
          <p className="text-xl text-blue-100">
            Connect with qualified implant specialists in your area and take the first step towards your new smile
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex shadow-lg rounded-lg overflow-hidden">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Enter ZIP Code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full px-6 py-4 text-gray-900 text-lg focus:outline-none"
                  pattern="[0-9]*"
                  maxLength={5}
                />
              </div>
              <button
                type="button"
                onClick={handleLocationClick}
                className="px-4 bg-white text-blue-600 hover:text-blue-700 border-l border-gray-200 flex items-center"
              >
                <MapPin className="h-5 w-5" />
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 flex items-center gap-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  ${selectedFilters.includes(filter)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'}
                  transition-colors
                `}
              >
                <Filter className="h-4 w-4" />
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 