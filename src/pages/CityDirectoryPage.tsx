import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Star, MapPin, Award, Filter } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  slug: string;
  image: string;
  state: string;
  stateCode: string;
  city: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  verified: boolean;
}

// Sample data - in a real app, this would come from an API
const sampleProviders: Provider[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    slug: 'dr-sarah-johnson',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    state: 'new-york',
    stateCode: 'ny',
    city: 'new-york-city',
    location: 'New York, NY',
    rating: 4.9,
    reviewCount: 128,
    specialties: ['Implants', 'Cosmetic'],
    verified: true,
  },
  // Add more sample providers as needed
];

const CityDirectoryPage = () => {
  const { city } = useParams<{ city: string }>();
  const formattedCity = city?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dental Implant Providers in {formattedCity}
            </h1>
            <p className="mt-2 text-gray-600">
              Find qualified implant specialists in {formattedCity}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Sort by Rating
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                Price Range
              </button>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleProviders.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {provider.verified && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                  <div className="flex items-center mt-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{provider.location}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-gray-900 font-medium">{provider.rating}</span>
                    </div>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">{provider.reviewCount} reviews</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`/dental-implants/${provider.state}/${provider.city}/${provider.slug}`}
                    className="mt-6 block w-full text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CityDirectoryPage; 