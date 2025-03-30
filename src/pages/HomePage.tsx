import React from 'react';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedProviders from '../components/home/FeaturedProviders';
import { MapPin, Book, DollarSign, Award, Users, Star, Stethoscope, ChevronRight, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProviders />

      {/* Browse by Location */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Browse by Location</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego'].map((city) => (
              <a
                key={city}
                href={`/locations/${city.toLowerCase().replace(' ', '-')}`}
                className="group relative overflow-hidden rounded-lg aspect-[4/3]"
              >
                <img
                  src={`https://source.unsplash.com/featured/?${city},city`}
                  alt={city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 flex items-end">
                  <div className="p-4 text-white">
                    <h3 className="font-bold">{city}</h3>
                    <p className="text-sm text-gray-200">50+ Providers</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Procedures */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Popular Procedures</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Single Tooth Implant',
                description: 'Replace one missing tooth with a permanent solution',
                price: '$3,000 - $4,500',
                icon: Stethoscope
              },
              {
                title: 'Full Mouth Implants',
                description: 'Complete restoration for all missing teeth',
                price: '$20,000 - $45,000',
                icon: Stethoscope
              },
              {
                title: 'All-on-4®',
                description: 'Full arch replacement with just 4 implants',
                price: '$15,000 - $30,000',
                icon: Stethoscope
              },
              {
                title: 'Implant-Supported Bridge',
                description: 'Bridge secured by dental implants',
                price: '$5,000 - $15,000',
                icon: Stethoscope
              }
            ].map((procedure) => (
              <div key={procedure.title} className="bg-white rounded-xl p-6 shadow-sm">
                <procedure.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{procedure.title}</h3>
                <p className="text-gray-600 mb-4">{procedure.description}</p>
                <p className="text-blue-600 font-medium">{procedure.price}</p>
                <a
                  href={`/procedures/${procedure.title.toLowerCase().replace(' ', '-')}`}
                  className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  Learn More
                  <ChevronRight className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Nearby Implants</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We connect you with the most qualified implant specialists, ensuring you receive the highest quality care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: '50,000+',
                description: 'Patients Connected'
              },
              {
                icon: Award,
                title: '1,000+',
                description: 'Verified Providers'
              },
              {
                icon: Star,
                title: '4.8/5',
                description: 'Average Provider Rating'
              }
            ].map((stat) => (
              <div key={stat.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.title}</h3>
                <p className="mt-2 text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-blue-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Are You a Dental Implant Provider?</h3>
                <p className="text-gray-600">
                  Join our network of trusted providers and connect with patients looking for quality implant care.
                </p>
                <ul className="mt-4 space-y-2">
                  {[
                    'Increase your online visibility',
                    'Connect with qualified patients',
                    'Showcase your expertise and results',
                    'Manage your profile and appointments'
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-center text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/3 flex justify-center">
                <a
                  href="/for-dentists"
                  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Join Our Network
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage; 