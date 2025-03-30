import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Award, ChevronRight } from 'lucide-react';

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
    state: 'california',
    stateCode: 'ca',
    city: 'los-angeles',
    location: 'Los Angeles, CA',
    rating: 4.8,
    reviewCount: 95,
    specialties: ['Implants', 'Oral Surgery'],
    verified: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    slug: 'dr-emily-rodriguez',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80',
    state: 'illinois',
    stateCode: 'il',
    city: 'chicago',
    location: 'Chicago, IL',
    rating: 4.7,
    reviewCount: 82,
    specialties: ['Implants', 'Periodontics'],
    verified: true,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    slug: 'dr-james-wilson',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=300&q=80',
    state: 'texas',
    stateCode: 'tx',
    city: 'houston',
    location: 'Houston, TX',
    rating: 4.9,
    reviewCount: 156,
    specialties: ['Implants', 'Prosthodontics'],
    verified: true,
  },
];

const FeaturedProviders = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Providers</h2>
            <p className="mt-2 text-gray-600">Top-rated implant specialists in your area</p>
          </div>
          <Link
            to="/dental-implants"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Providers
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 space-x-6 no-scrollbar">
            {sampleProviders.map((provider) => (
              <div
                key={provider.id}
                className="flex-none w-[300px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-48 object-cover rounded-t-xl"
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
            ))}
          </div>
          <div className="absolute left-0 top-0 bottom-6 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-6 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/dental-implants"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Providers
            <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders; 