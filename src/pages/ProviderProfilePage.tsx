import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SEOHead from '../components/common/SEOHead';
import { Star, MapPin, Phone, Mail, Globe, Clock, Shield, Languages, Users, Share2, Heart, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Home, ThumbsUp, X, MessageSquare, Building2 } from 'lucide-react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Import required Swiper modules
import { Navigation, Pagination } from 'swiper/modules';

interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

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
  acceptingNewPatients: boolean;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  practiceInfo: {
    size: string;
    languages: string[];
    safetyMeasures: string[];
  };
  officeHours: OfficeHours;
  team: {
    name: string;
    role: string;
    image: string;
  }[];
  treatmentGallery: {
    id: string;
    title: string;
    image: string;
  }[];
  insurancePlans: {
    name: string;
    type: string;
  }[];
  paymentMethods: string[];
  financingOptions: {
    title: string;
    description: string;
  }[];
  services: Service[];
  categories: Category[];
  reviews: {
    id: string;
    author: {
      name: string;
      avatar?: string;
      verified: boolean;
    };
    rating: number;
    title?: string;
    text: string;
    date: string;
    helpful: number;
    verifiedVisit: boolean;
    visitDate?: string;
    response?: {
      text: string;
      date: string;
      author: string;
    };
  }[];
  isClaimed: boolean;
  isAdminApproved: boolean;
}

// Add new interfaces for related content
interface RelatedProvider {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  slug: string;
}

interface PopularProcedure {
  title: string;
  description: string;
  slug: string;
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
] as const;

type DayOfWeek = typeof DAYS_OF_WEEK[number];

// Update the OfficeHours interface
interface DayHours {
  isOpen: boolean;
  hours: string;
}

interface OfficeHours {
  Monday: DayHours;
  Tuesday: DayHours;
  Wednesday: DayHours;
  Thursday: DayHours;
  Friday: DayHours;
  Saturday: DayHours;
  Sunday: DayHours;
}

const parseTimeString = (timeStr: string): Date | null => {
  if (timeStr === 'Closed') return null;
  
  const today = new Date();
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  
  const date = new Date(today);
  date.setHours(
    period === 'PM' && hours !== 12 ? hours + 12 : hours,
    minutes || 0,
    0,
    0
  );
  
  return date;
};

const isCurrentlyOpen = (hours: OfficeHours): boolean => {
  const now = new Date();
  const currentDay = DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const todayHours = hours[currentDay];

  if (!todayHours.isOpen) return false;

  const [startStr, endStr] = todayHours.hours.split(' - ');
  const startTime = parseTimeString(startStr);
  const endTime = parseTimeString(endStr);

  if (!startTime || !endTime) return false;

  return now >= startTime && now <= endTime;
};

const getTimeUntil = (targetTime: Date): string => {
  const now = new Date();
  const diff = targetTime.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

const OfficeHoursSection = ({ hours }: { hours: OfficeHours }) => {
  const isOpen = isCurrentlyOpen(hours);
  const now = new Date();
  const currentDay = DAYS_OF_WEEK[now.getDay() === 0 ? 6 : now.getDay() - 1];
  const todayHours = hours[currentDay];

  // Calculate time until opening/closing
  let timeStatus = '';
  if (todayHours.isOpen) {
    const [, endStr] = todayHours.hours.split(' - ');
    const endTime = parseTimeString(endStr);
    if (endTime && isOpen) {
      timeStatus = `Closes in ${getTimeUntil(endTime)}`;
    }
  } else {
    // Find next open day
    let nextOpenDay = currentDay;
    let daysChecked = 0;
    let foundNextOpen = false;

    while (daysChecked < 7 && !foundNextOpen) {
      const nextDayIndex = (DAYS_OF_WEEK.indexOf(nextOpenDay) + 1) % 7;
      nextOpenDay = DAYS_OF_WEEK[nextDayIndex];
      if (hours[nextOpenDay].isOpen) {
        const [startStr] = hours[nextOpenDay].hours.split(' - ');
        const nextOpenTime = parseTimeString(startStr);
        if (nextOpenTime) {
          // Adjust date to next occurrence of this day
          const daysToAdd = daysChecked + 1;
          nextOpenTime.setDate(nextOpenTime.getDate() + daysToAdd);
          timeStatus = `Opens in ${getTimeUntil(nextOpenTime)}`;
          foundNextOpen = true;
        }
      }
      daysChecked++;
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Office Hours</h2>
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              isOpen
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            <Clock className="h-4 w-4 mr-1.5" />
            {isOpen ? 'Open Now' : 'Closed Now'}
          </span>
          {timeStatus && (
            <span className="text-sm text-gray-500 mt-1">{timeStatus}</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        {DAYS_OF_WEEK.map((day) => {
          const isToday = day === currentDay;
          const dayHours = hours[day];
          
          return (
            <div
              key={day}
              className={`flex justify-between items-center py-2.5 px-3 rounded-lg transition-colors whitespace-nowrap
                ${isToday ? 'bg-blue-50' : 'hover:bg-gray-50'}
                ${dayHours.isOpen ? 'cursor-default' : 'opacity-75'}`}
            >
              <div className="flex items-center gap-2 min-w-[100px]">
                {dayHours.isOpen ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                )}
                <span className={`${isToday ? 'font-medium text-blue-900' : 'text-gray-600'} truncate`}>
                  {day}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <span 
                  className={`${isToday ? 'font-medium text-blue-900' : 'text-gray-600'} truncate`}
                  title={dayHours.isOpen ? `Hours: ${dayHours.hours}` : 'Closed today'}
                >
                  {dayHours.hours}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// Add to the sample data
const sampleRelatedProviders: RelatedProvider[] = [
  {
    id: '2',
    name: 'Elgin Dental Care',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=300&q=80',
    specialties: ['Dental Implants', 'Cosmetic Dentistry'],
    rating: 4.7,
    reviewCount: 123,
    location: 'Elgin, IL',
    slug: 'dental-implants-elgin-dental-care'
  },
  {
    id: '3',
    name: 'Advanced Dental Implants',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=300&q=80',
    specialties: ['Dental Implants', 'Oral Surgery'],
    rating: 4.9,
    reviewCount: 89,
    location: 'Elgin, IL',
    slug: 'advanced-dental-implants-elgin'
  }
];

const popularProcedures: PopularProcedure[] = [
  {
    title: 'Single Tooth Implants',
    description: 'Replace a missing tooth with a permanent, natural-looking solution',
    slug: 'single-tooth-implants'
  },
  {
    title: 'All-on-4 Implants',
    description: 'Full arch replacement with just 4 implants',
    slug: 'all-on-4-implants'
  },
  {
    title: 'Mini Dental Implants',
    description: 'Less invasive option for qualifying patients',
    slug: 'mini-dental-implants'
  }
];

// Add sample provider data
const sampleProvider: Provider = {
  id: '1',
  name: '1st Family Dental of Elgin',
  slug: 'dental-implants-1st-family-dental-elgin',
  image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
  state: 'illinois',
  stateCode: 'il',
  city: 'elgin',
  location: 'Elgin, IL 60123',
  rating: 4.8,
  reviewCount: 150,
  specialties: ['Dental Implants', 'General Dentistry', 'Cosmetic Dentistry', 'Orthodontics'],
  verified: true,
  acceptingNewPatients: true,
  address: '1234 Dental Way',
  zipCode: '60123',
  phone: '(847) 214-8888',
  email: 'info@1stfamilydental.com',
  website: 'www.1stfamilydental.com',
  practiceInfo: {
    size: '5 Dentists, 8 Hygienists',
    languages: ['English', 'Spanish', 'Polish'],
    safetyMeasures: ['Enhanced cleaning protocols', 'PPE', 'Air purification'],
  },
  officeHours: {
    Monday: { isOpen: true, hours: '8:00 AM - 7:00 PM' },
    Tuesday: { isOpen: true, hours: '8:00 AM - 7:00 PM' },
    Wednesday: { isOpen: true, hours: '8:00 AM - 7:00 PM' },
    Thursday: { isOpen: true, hours: '8:00 AM - 7:00 PM' },
    Friday: { isOpen: true, hours: '8:00 AM - 7:00 PM' },
    Saturday: { isOpen: true, hours: '9:00 AM - 3:00 PM' },
    Sunday: { isOpen: false, hours: 'Closed' },
  },
  team: [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Lead Dentist',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Implant Specialist',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Periodontist',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=300&q=80',
    },
  ],
  treatmentGallery: [
    {
      id: '1',
      title: 'Dental Implants',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: '2',
      title: 'All-on-4 Implants',
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=400&q=80',
    }
  ],
  insurancePlans: [
    { name: 'Delta Dental', type: 'dental' },
    { name: 'Blue Cross Blue Shield', type: 'dental' },
    { name: 'Cigna', type: 'dental' },
    { name: 'Aetna', type: 'dental' },
    { name: 'MetLife', type: 'dental' },
    { name: 'Guardian', type: 'dental' },
    { name: 'United Healthcare', type: 'dental' },
    { name: 'Humana', type: 'dental' }
  ],
  paymentMethods: [
    'Credit Cards',
    'Debit Cards',
    'Cash',
    'HSA/FSA',
    'Personal Checks',
    'Apple Pay',
    'Google Pay',
    'Payment Plans'
  ],
  financingOptions: [
    {
      title: 'CareCredit',
      description: '0% interest if paid in full within 6-18 months for qualifying purchases',
    },
    {
      title: 'In-House Payment Plans',
      description: 'Flexible monthly payment options with no interest for qualifying patients',
    }
  ],
  categories: [
    { id: 'cosmetic', name: 'Cosmetic Dentistry' },
    { id: 'orthodontics', name: 'Orthodontics' },
    { id: 'periodontics', name: 'Periodontics' },
    { id: 'emergency', name: 'Emergency Care' }
  ],
  services: [
    { id: 'teeth-whitening', name: 'Teeth Whitening', category: 'cosmetic' },
    { id: 'veneers', name: 'Veneers', category: 'cosmetic' },
    { id: 'braces', name: 'Braces', category: 'orthodontics' },
    { id: 'invisalign', name: 'Invisalign', category: 'orthodontics' },
    { id: 'dental-implants', name: 'Dental Implants', category: 'periodontics' },
    { id: 'root-canal', name: 'Root Canal Therapy', category: 'emergency' }
  ],
  reviews: [
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
        verified: true
      },
      rating: 5,
      title: 'Excellent Dental Implant Experience',
      text: 'Dr. Smith and his team were amazing! The entire process was smooth and professional. I\'m very happy with my dental implants.',
      date: '2024-02-15',
      helpful: 12,
      verifiedVisit: true,
      visitDate: '2024-01-20',
      response: {
        text: 'Thank you for your kind words, Sarah! We\'re glad you had a great experience with us.',
        date: '2024-02-16',
        author: 'Dr. Smith'
      }
    },
    {
      id: '2',
      author: {
        name: 'Michael Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
        verified: true
      },
      rating: 4,
      title: 'Great Service Overall',
      text: 'Great service overall. The office is modern and clean. Staff is friendly and attentive.',
      date: '2024-02-10',
      helpful: 8,
      verifiedVisit: true,
      visitDate: '2024-01-15'
    }
  ],
  isClaimed: true,
  isAdminApproved: true,
};

// Helper functions for related content
interface GeoLocation {
  lat: number;
  lng: number;
}

interface LocationWithDistance {
  city: string;
  state: string;
  distance: number;
  providerCount: number;
}

// Function to get nearby cities based on coordinates
const getNearbyLocations = (
  currentLocation: GeoLocation,
  radius: number = 25, // miles
  limit: number = 4
): LocationWithDistance[] => {
  // In a real implementation, this would:
  // 1. Query a geolocation database or API
  // 2. Calculate distances using Haversine formula
  // 3. Filter by radius and sort by distance
  // 4. Include provider count in each location
  return [
    { city: 'South Elgin', state: 'illinois', distance: 5.2, providerCount: 12 },
    { city: 'Bartlett', state: 'illinois', distance: 8.7, providerCount: 8 },
    { city: 'Streamwood', state: 'illinois', distance: 10.1, providerCount: 15 },
    { city: 'Schaumburg', state: 'illinois', distance: 12.4, providerCount: 25 }
  ];
};

// Function to get popular cities in a state
const getPopularCitiesInState = (
  state: string,
  limit: number = 4
): LocationWithDistance[] => {
  // In a real implementation, this would:
  // 1. Query database for cities in the state
  // 2. Sort by number of providers and search volume
  // 3. Return top cities by popularity
  return [
    { city: 'Chicago', state: 'illinois', distance: 0, providerCount: 245 },
    { city: 'Aurora', state: 'illinois', distance: 0, providerCount: 87 },
    { city: 'Naperville', state: 'illinois', distance: 0, providerCount: 65 },
    { city: 'Joliet', state: 'illinois', distance: 0, providerCount: 42 }
  ];
};

// Function to get related providers
const getRelatedProviders = (
  currentProvider: Provider,
  limit: number = 2
): RelatedProvider[] => {
  // In a real implementation, this would:
  // 1. Query providers in the same city/area
  // 2. Filter by matching specialties
  // 3. Sort by rating and review count
  // 4. Calculate relevance score based on:
  //    - Distance from current provider
  //    - Number of matching specialties
  //    - Rating and review count
  //    - Availability of specific procedures
  return sampleRelatedProviders;
};

// Function to get popular procedures
const getPopularProcedures = (
  provider: Provider,
  limit: number = 3
): PopularProcedure[] => {
  // In a real implementation, this would:
  // 1. Query procedures database
  // 2. Filter by provider's specialties
  // 3. Sort by:
  //    - Global popularity
  //    - Provider's expertise
  //    - Local demand
  //    - Insurance coverage
  return popularProcedures;
};

// Add Breadcrumb interfaces
interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

// Breadcrumb component
const BreadcrumbNav = ({ items }: BreadcrumbNavProps) => {
  // Generate schema markup for breadcrumbs
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@id": item.href || window.location.href,
        "name": item.label
      }
    }))
  };

  return (
    <>
      {/* Schema markup */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* Visual breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <a 
              href="/" 
              className="text-gray-500 hover:text-blue-600 transition-colors flex items-center"
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
            </a>
          </li>
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center">
              <ChevronRight className="h-4 w-4 text-gray-400 mr-2" />
              {item.isCurrentPage ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="text-gray-500 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

// Add ReviewFormModal component
const ReviewFormModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (review: any) => void; 
}) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [visitDate, setVisitDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      title,
      text,
      visitDate
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Give your review a title"
                required
              />
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Share your experience with this provider"
                required
              />
            </div>

            {/* Visit Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visit Date
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add ContactOwnerModal component
const ContactOwnerModal = ({ isOpen, onClose, onSubmit }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (data: any) => void; 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      message,
      isClaiming
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {isClaiming ? 'Claim This Listing' : 'Contact Listing Owner'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={isClaiming ? "Please provide details about your ownership of this practice..." : "Your message..."}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isClaiming ? 'Submit Claim' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Add this helper function at the top level
const calculateAverageRating = (reviews: Provider['reviews']) => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
};

// Add AllReviewsModal component
const AllReviewsModal = ({ isOpen, onClose, reviews }: { 
  isOpen: boolean; 
  onClose: () => void;
  reviews: Provider['reviews'];
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">All Reviews</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-t border-gray-100 pt-6 first:border-t-0 first:pt-0">
                <div className="flex items-start gap-4">
                  {review.author.avatar && (
                    <img
                      src={review.author.avatar}
                      alt={review.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{review.author.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <time className="text-sm text-gray-500">
                        {new Date(review.date).toLocaleDateString()}
                      </time>
                    </div>
                    {review.title && (
                      <h5 className="font-medium text-gray-900 mt-2">{review.title}</h5>
                    )}
                    <p className="mt-2 text-gray-600">{review.text}</p>
                    {review.verifiedVisit && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-700">Verified Visit</span>
                        {review.visitDate && (
                          <span className="text-sm text-gray-500">
                            - Visited on {new Date(review.visitDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                    {review.response && (
                      <div className="mt-4 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{review.response.author}</span>
                          <time className="text-sm text-gray-500">
                            {new Date(review.response.date).toLocaleDateString()}
                          </time>
                        </div>
                        <p className="text-gray-600">{review.response.text}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-4">
                      <button className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProviderProfilePage = () => {
  const { state, city, providerSlug } = useParams<{ state: string; city: string; providerSlug: string }>();
  
  // In a real application, you would fetch the provider data based on the URL parameters
  const provider = sampleProvider;

  // Get related content using helper functions
  const nearbyLocations = getNearbyLocations({ lat: 42.0354, lng: -88.2825 }); // Example coordinates for Elgin, IL
  const popularCities = getPopularCitiesInState(provider.state);
  const relatedProviders = getRelatedProviders(provider);
  const procedures = getPopularProcedures(provider);

  // Generate breadcrumb items
  const breadcrumbItems: BreadcrumbItem[] = [
    {
      label: 'Dental Implants',
      href: '/dental-implants'
    },
    {
      label: provider.state.charAt(0).toUpperCase() + provider.state.slice(1),
      href: `/dental-implants/${provider.state}`
    },
    {
      label: provider.city,
      href: `/dental-implants/${provider.state}/${provider.city}`
    },
    {
      label: provider.name,
      isCurrentPage: true
    }
  ];

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isAllReviewsModalOpen, setIsAllReviewsModalOpen] = useState(false);

  const handleReviewSubmit = (review: any) => {
    // Here you would typically:
    // 1. Send the review to your backend API
    // 2. Update the local state with the new review
    // 3. Show a success message
    console.log('New review:', review);
  };

  const handleContactSubmit = (data: any) => {
    // Here you would typically:
    // 1. Send the contact/claim request to your backend API
    // 2. Show a success message
    // 3. Handle any errors
    console.log('Contact/Claim submission:', data);
  };

  if (!provider) {
    return (
      <Layout>
        <SEOHead
          title="Provider Not Found | Nearby Implants"
          description="The dental provider you're looking for could not be found. Browse other top-rated dental implant specialists in your area."
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Not Found</h1>
            <p className="text-gray-600">The provider you're looking for could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Format location for meta tags
  const formattedLocation = `${provider.city}, ${provider.stateCode.toUpperCase()}`;
  
  // Construct meta title and description
  const metaTitle = `${provider.name} | Dental Implants & Comprehensive Care in ${formattedLocation}`;
  const metaDescription = `Looking for expert dental implants and specialized care in ${formattedLocation}? ${provider.name} offers advanced treatments, state-of-the-art technology, and patient-focused care. Schedule your consultation today!`;

  // Construct canonical URL
  const canonicalUrl = `${window.location.origin}/dental-implants/${provider.state}/${provider.city}/${provider.slug}`;

  return (
    <Layout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        canonicalUrl={canonicalUrl}
        type="profile"
        imageUrl={provider.image}
      />
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {/* Breadcrumb navigation */}
          <BreadcrumbNav items={breadcrumbItems} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-4 space-y-6">
              {/* Hero Section with Image Carousel */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative max-h-[400px] lg:max-h-[500px]">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation={{
                      prevEl: '.hero-swiper-button-prev',
                      nextEl: '.hero-swiper-button-next',
                    }}
                    pagination={{ clickable: true }}
                    className="h-full"
                  >
                    <SwiperSlide>
                      <div className="relative aspect-[16/9] lg:aspect-[2/1]">
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </SwiperSlide>
                    {provider.treatmentGallery.map((image) => (
                      <SwiperSlide key={image.id}>
                        <div className="relative aspect-[16/9] lg:aspect-[2/1]">
                          <img
                            src={image.image}
                            alt={image.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="hero-swiper-button-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button className="hero-swiper-button-next absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                      <Heart className="h-5 w-5 text-gray-700" />
                    </button>
                    <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                      <Share2 className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Header Content */}
                <div className="p-6">
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    {provider.acceptingNewPatients && (
                      <span className="inline-flex items-center bg-emerald-50 text-emerald-700 text-sm font-medium px-3 py-1.5 rounded-full border border-emerald-200">
                        Accepting New Patients
                      </span>
                    )}
                    {provider.isClaimed && provider.isAdminApproved && (
                      <span className="inline-flex items-center bg-sky-50 text-sky-700 text-sm font-medium px-3 py-1.5 rounded-full border border-sky-200">
                        <Shield className="h-4 w-4 mr-1.5" />
                        Verified Profile
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">{provider.name}</h1>
                  <div className="flex items-center flex-wrap gap-4 text-gray-600 mb-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1.5 font-medium">{calculateAverageRating(provider.reviews).toFixed(1)}</span>
                      <span className="ml-1">({provider.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-1.5" />
                      <span>{provider.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="#"
                      onClick={() => window.location.href = 'tel:' + provider.phone}
                      className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center flex items-center justify-center sm:flex-1"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Book Appointment
                    </a>
                    <a
                      href={`tel:${provider.phone}`}
                      className="bg-white border border-blue-600 text-blue-600 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center flex items-center justify-center sm:flex-1"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      {provider.phone}
                    </a>
                    {provider.website && (
                      <a
                        href={`https://${provider.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center flex items-center justify-center sm:flex-1"
                      >
                        <Globe className="h-5 w-5 mr-2" />
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* About Practice */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About the Practice</h2>
                <p className="text-gray-600 leading-relaxed">
                  {provider.name} is a comprehensive dental care provider offering a wide range of services for
                  patients of all ages. Our state-of-the art facility is equipped with the latest technology, and our
                  experienced team is committed to providing comfortable, personalized care in a welcoming environment.
                </p>
              </section>

              {/* Our Specialties */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Our Specialties</h2>
                <div className="space-y-6">
                  {/* Categories */}
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-gray-900">Specialty Categories</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {provider.categories.map((category) => (
                        <div
                          key={category.id}
                          className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-2 rounded-lg text-center text-sm font-medium"
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-3">
                    <h4 className="text-base font-semibold text-gray-900">Available Services</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {provider.services.map((service) => (
                        <div
                          key={service.id}
                          className="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-2 rounded-lg text-center text-sm font-medium"
                        >
                          {service.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Office Hours and Location Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Office Hours */}
                <OfficeHoursSection hours={provider.officeHours} />

                {/* Location */}
                <section className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Location</h2>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {provider.address}, {provider.city}, {provider.stateCode.toUpperCase()} {provider.zipCode}
                    </p>
                    <div className="aspect-[4/3] bg-gray-100 rounded-lg">
                      {/* Map will go here */}
                    </div>
                    <button className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Get Directions
                    </button>
                  </div>
                </section>
              </div>

              {/* Our Team */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Our Team</h2>
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{
                      prevEl: '.team-swiper-button-prev',
                      nextEl: '.team-swiper-button-next',
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      640: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 3,
                      },
                    }}
                    className="!pb-12"
                  >
                    {provider.team.map((member) => (
                      <SwiperSlide key={member.name}>
                        <div className="bg-gray-50 rounded-lg p-6">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-28 h-28 rounded-lg mx-auto mb-4 object-cover"
                          />
                          <h3 className="text-gray-900 font-medium text-lg text-center">{member.name}</h3>
                          <p className="text-gray-600 text-center mt-1">{member.role}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="team-swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-4 z-10 bg-white shadow-sm rounded-lg p-2 hover:bg-gray-50">
                    <ChevronLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="team-swiper-button-next absolute top-1/2 -translate-y-1/2 -right-4 z-10 bg-white shadow-sm rounded-lg p-2 hover:bg-gray-50">
                    <ChevronRight className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </section>

              {/* Treatment Gallery */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Treatment Gallery</h2>
                <div className="relative">
                  <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation={{
                      prevEl: '.treatment-swiper-button-prev',
                      nextEl: '.treatment-swiper-button-next',
                    }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                      768: {
                        slidesPerView: 2,
                      }
                    }}
                    className="!pb-12"
                  >
                    {provider.treatmentGallery.map((treatment) => (
                      <SwiperSlide key={treatment.id}>
                        <div className="relative aspect-[4/3] group cursor-pointer overflow-hidden rounded-lg">
                          <img
                            src={treatment.image}
                            alt={treatment.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-100">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-medium text-lg">{treatment.title}</h3>
                              <p className="text-white/80 text-sm mt-1">Click to view details</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <button className="treatment-swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button className="treatment-swiper-button-next absolute top-1/2 -translate-y-1/2 -right-4 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors">
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </div>
              </section>

              {/* Insurance & Payment */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Accepted Insurance Plans</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
                  {provider.insurancePlans.map((plan) => (
                    <div
                      key={plan.name}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg text-center text-sm font-medium"
                    >
                      {plan.name}
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">Payment Methods</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                  {provider.paymentMethods.map((method) => (
                    <div
                      key={method}
                      className="bg-violet-50 text-violet-700 border border-violet-200 px-3 py-2 rounded-lg text-center text-sm font-medium"
                    >
                      {method}
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-3">Financing Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {provider.financingOptions.map((option) => (
                    <div
                      key={option.title}
                      className="bg-amber-50 border border-amber-200 p-4 rounded-lg"
                    >
                      <h4 className="font-bold text-amber-900 mb-2">{option.title}</h4>
                      <p className="text-amber-800 text-sm leading-relaxed">{option.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Popular Procedures */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Dental Implant Procedures</h2>
                <div className="space-y-3">
                  {procedures.map((procedure) => (
                    <a
                      key={procedure.title}
                      href={`/procedures/${procedure.slug}`}
                      className="block p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900">{procedure.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{procedure.description}</p>
                    </a>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column - Sidebar Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Practice Information */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Practice Information</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Practice Size</h3>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="bg-gray-50 text-gray-700 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                        {provider.practiceInfo.size}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Languages</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {provider.practiceInfo.languages.map((language) => (
                        <span key={language} className="bg-teal-50 text-teal-700 border border-teal-200 px-3 py-2 rounded-lg text-sm text-center">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Safety Measures</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {provider.practiceInfo.safetyMeasures.map((measure) => (
                        <span key={measure} className="bg-green-50 text-green-700 border border-green-200 px-3 py-2 rounded-lg text-sm text-center">
                          {measure}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Reviews Section */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Reviews</h2>
                  <button
                    onClick={() => setIsReviewModalOpen(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Star className="h-4 w-4 mr-1.5 text-yellow-400" />
                    Write Review
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Overall Rating */}
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {calculateAverageRating(provider.reviews).toFixed(1)}
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(calculateAverageRating(provider.reviews))
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      ({provider.reviews.length} reviews)
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div className="space-y-4">
                    {provider.reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                        <div className="flex items-start gap-3">
                          {review.author.avatar && (
                            <img
                              src={review.author.avatar}
                              alt={review.author.name}
                              className="w-8 h-8 rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{review.author.name}</h4>
                                <div className="flex items-center gap-1 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <time className="text-xs text-gray-500">
                                {new Date(review.date).toLocaleDateString()}
                              </time>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{review.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* View All Reviews Link */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsAllReviewsModalOpen(true);
                    }}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center"
                  >
                    View all reviews
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </section>

              {/* Contact Information Section */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Contact</h2>
                <div className="space-y-4">
                  {provider.isClaimed ? (
                    <div className="flex items-center gap-2 text-sm text-sky-600">
                      <Shield className="h-4 w-4" />
                      <span>Listing claimed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="h-4 w-4" />
                      <span>This listing is managed by Nearby Implants</span>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => {
                        setIsClaiming(false);
                        setIsContactModalOpen(true);
                      }}
                      className="w-full bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center"
                    >
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Send a Message
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Your message is secure and HIPAA-compliant
                    </p>
                  </div>
                </div>
              </section>

              {/* Claim Profile Section */}
              {!provider.isClaimed && (
                <section className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Claim Your Profile</h2>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Are you the owner of this practice? Claim your profile to:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Respond to patient messages directly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Update practice information</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>Manage your online presence</span>
                      </li>
                    </ul>
                    <button
                      onClick={() => {
                        setIsClaiming(true);
                        setIsContactModalOpen(true);
                      }}
                      className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      List Your Practice
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Our team will verify your ownership and approve your claim
                    </p>
                  </div>
                </section>
              )}

              {/* Related Providers */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Related Providers Nearby</h2>
                <div className="space-y-3">
                  {relatedProviders.map((relatedProvider) => (
                    <a
                      key={relatedProvider.id}
                      href={`/dental-implants/${provider.state}/${provider.city}/${relatedProvider.slug}`}
                      className="flex items-start p-3 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <img
                        src={relatedProvider.image}
                        alt={relatedProvider.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="ml-3">
                        <h3 className="font-medium text-gray-900 text-sm">{relatedProvider.name}</h3>
                        <div className="flex items-center mt-1 text-xs">
                          <Star className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-medium">{relatedProvider.rating}</span>
                          <span className="ml-1 text-gray-600">({relatedProvider.reviewCount} reviews)</span>
                        </div>
                        <div className="mt-1 text-xs text-gray-600">
                          {relatedProvider.specialties.join(' • ')}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
                <a
                  href="#all-providers"
                  onClick={(e) => {
                    e.preventDefault();
                    const section = document.getElementById('all-providers');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center"
                >
                  View all providers in {provider.city}
                  <span className="text-sm text-gray-600 ml-1">({nearbyLocations.find(l => l.city.toLowerCase() === provider.city.toLowerCase())?.providerCount || '0'} providers)</span>
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </section>

              {/* Location Links */}
              <section className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Explore More Locations</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Nearby Cities</h3>
                    <div className="flex flex-wrap gap-2">
                      {nearbyLocations.map((location) => (
                        <a
                          key={location.city}
                          href={`/dental-implants/${location.state}/${location.city.toLowerCase().replace(' ', '-')}`}
                          className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {location.city}
                          <span className="text-gray-500 text-xs ml-1">({Math.round(location.distance)}mi)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Popular Areas in {provider.stateCode.toUpperCase()}</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularCities.map((location) => (
                        <a
                          key={location.city}
                          href={`/dental-implants/${location.state}/${location.city.toLowerCase()}`}
                          className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                        >
                          {location.city}
                          <span className="text-gray-500 text-xs ml-1">({location.providerCount} providers)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* All Providers Section */}
              <section id="all-providers" className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">All Providers in {provider.city}</h2>
                <div className="grid gap-4">
                  {relatedProviders.map((relatedProvider) => (
                    <a
                      key={relatedProvider.id}
                      href={`/dental-implants/${provider.state}/${provider.city}/${relatedProvider.slug}`}
                      className="flex items-start p-4 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/50 transition-colors"
                    >
                      <img
                        src={relatedProvider.image}
                        alt={relatedProvider.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-900">{relatedProvider.name}</h3>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1.5 font-medium">{relatedProvider.rating}</span>
                          <span className="ml-1 text-gray-600">({relatedProvider.reviewCount} reviews)</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          {relatedProvider.specialties.join(' • ')}
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {relatedProvider.location}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Add ReviewFormModal */}
      <ReviewFormModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />

      {/* Add ContactOwnerModal */}
      <ContactOwnerModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSubmit={handleContactSubmit}
      />

      {/* Add AllReviewsModal */}
      <AllReviewsModal
        isOpen={isAllReviewsModalOpen}
        onClose={() => setIsAllReviewsModalOpen(false)}
        reviews={provider.reviews}
      />
    </Layout>
  );
};

export default ProviderProfilePage;