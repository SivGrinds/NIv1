import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Star, MapPin, Award, TrendingUp, Clock, ChevronRight } from 'lucide-react';

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

interface City {
  name: string;
  slug: string;
  providerCount: number;
  image: string;
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
  {
    id: '2',
    name: 'Dr. Michael Chen',
    slug: 'dr-michael-chen',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    state: 'new-york',
    stateCode: 'ny',
    city: 'buffalo',
    location: 'Buffalo, NY',
    rating: 4.8,
    reviewCount: 95,
    specialties: ['Implants', 'Oral Surgery'],
    verified: true,
  },
  // Add more providers as needed
];

const cities: City[] = [
  { name: 'New York City', slug: 'new-york-city', providerCount: 45, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&q=80' },
  { name: 'Buffalo', slug: 'buffalo', providerCount: 12, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Albany', slug: 'albany', providerCount: 8, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Rochester', slug: 'rochester', providerCount: 10, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=300&q=80' },
  { name: 'Syracuse', slug: 'syracuse', providerCount: 6, image: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?auto=format&fit=crop&w=300&q=80' },
];

const ProviderCard = ({ provider }: { provider: Provider }) => (
  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
      <Link
        to={`/dental-implants/${provider.state}/${provider.city}/${provider.slug}`}
        className="mt-6 block w-full text-center bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        View Profile
      </Link>
    </div>
  </div>
);

const CityCard = ({ city }: { city: City }) => (
  <Link
    to={`/dental-implants/new-york/${city.slug}`}
    className="group relative overflow-hidden rounded-lg aspect-[4/3]"
  >
    <img
      src={city.image}
      alt={city.name}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 flex items-end">
      <div className="p-4 text-white">
        <h3 className="font-bold">{city.name}</h3>
        <p className="text-sm text-gray-200">{city.providerCount} Providers</p>
      </div>
    </div>
  </Link>
);

const StateDirectoryPage = () => {
  const { state } = useParams<{ state: string }>();
  const formattedState = state?.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Dental Implant Providers in {formattedState}
            </h1>
            <p className="mt-2 text-gray-600">
              Find qualified implant specialists across {formattedState}
            </p>
          </div>

          {/* Featured Providers Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Featured Providers</h2>
              <Link to={`/dental-implants/${state}`} className="text-blue-600 hover:text-blue-700 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProviders.slice(0, 3).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </section>

          {/* Newly Added Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Newly Added</h2>
              <Link to={`/dental-implants/${state}`} className="text-blue-600 hover:text-blue-700 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProviders.slice(3, 6).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </section>

          {/* Top Rated Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
              <Link to={`/dental-implants/${state}`} className="text-blue-600 hover:text-blue-700 flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleProviders.slice(6, 9).map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </section>

          {/* Cities Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by City</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cities.map((city) => (
                <CityCard key={city.slug} city={city} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default StateDirectoryPage; 