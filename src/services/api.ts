import { API_BASE_URL } from '@/config/api';

// Types
export interface Accommodation {
  id: number;
  name: string;
  type: string;
  description?: string;
  price: number;
  capacity: number;
  rooms: number;
  available: boolean;
  features: string[];
  images: string[];
  amenity_ids?: string[];
  address: string;
  cityId?: number;
  city_id?: number;
  latitude: number | string;
  longitude: number | string;
  package?: any;
  adult_price?: number;
  child_price?: number;
  availableRooms?: number;
  detailedInfo?: any;
  MaxPersonVilla?: number;
  RatePerPerson?: number;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  category: string;
  source?: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
  image?: string;
  active?: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
}

export interface BookingPayload {
  accommodation_id: number;
  check_in: string;
  check_out: string;
  rooms: number;
  adults: number;
  children: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  total_amount: number;
  advance_amount: number;
  food_veg?: number;
  food_nonveg?: number;
  food_jain?: number;
  special_requests?: string;
  coupon_code?: string;
}

// Helper function to parse string to array
const parseStringToArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      if (value.startsWith('[')) {
        return JSON.parse(value);
      }
      return value.split(',').map((f: string) => f.trim());
    } catch {
      return value.split(',').map((f: string) => f.trim());
    }
  }
  return [];
};

// API Functions
export const api = {
  // Properties
  async getProperties(): Promise<Accommodation[]> {
    const response = await fetch(`${API_BASE_URL}/admin/properties/accommodations`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const responseData = await response.json();
    const data = responseData.data || [];
    
    const mapped: Accommodation[] = data.map((item: any) => ({
      id: item.id || 0,
      name: item.name || '',
      type: item.type || '',
      description: item.description || '',
      price: parseFloat(item.price) || 0,
      capacity: item.capacity || 0,
      rooms: item.rooms || 0,
      available: Boolean(item.available),
      features: parseStringToArray(item.features),
      images: item.package?.images?.length > 0
        ? parseStringToArray(item.package.images)
        : parseStringToArray(item.images),
      amenity_ids: parseStringToArray(item.amenity_ids),
      address: item.address || '',
      cityId: item.city_id || item.cityId,
      city_id: item.city_id || item.cityId,
      latitude: parseFloat(item.latitude) || 0,
      longitude: parseFloat(item.longitude) || 0,
      package: item.package || undefined,
      adult_price: item.adult_price || parseFloat(item.price) || 0,
      child_price: item.child_price || 0,
      availableRooms: item.rooms || 0,
      MaxPersonVilla: item.maxPerson || item.MaxPersonVilla,
      RatePerPerson: item.ratePerPerson || item.RatePersonVilla,
    }));
    
    // Filter only available and remove duplicates
    const onlyAvailable = mapped.filter((item) => item.available === true);
    const unique = onlyAvailable.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );
    
    // Sort by id
    return [...unique].sort((a, b) => a.id - b.id);
  },

  async getProperty(id: number): Promise<Accommodation> {
    const res = await fetch(`${API_BASE_URL}/admin/properties/accommodations/${id}`);
    if (!res.ok) throw new Error('Failed to fetch accommodation');
    
    const data = await res.json();
    const basicInfo = data.basicInfo || data;
    const packages = data.packages || {};
    const location = data.location || {};
    
    let accommodationImages: string[] = [];
    try {
      const imgs = basicInfo.images || data.images;
      if (typeof imgs === 'string') {
        accommodationImages = JSON.parse(imgs);
      } else if (Array.isArray(imgs)) {
        accommodationImages = imgs;
      }
    } catch (e) {
      console.error('Failed to parse images:', e);
    }
    
    const features = (() => {
      try {
        const featArr = basicInfo.features || data.features;
        if (Array.isArray(featArr)) return featArr;
        if (typeof featArr === 'string') return JSON.parse(featArr);
        return [];
      } catch {
        return [];
      }
    })();
    
    return {
      id: data.id || basicInfo.id,
      name: basicInfo.name || data.name,
      description: packages.description || basicInfo.description || data.description || data.package_description || '',
      price: basicInfo.price || data.price || packages.pricing?.adult || 0,
      type: basicInfo.type || data.type,
      address: location.address || data.address || '',
      cityId: location.city?.id || data.city_id || basicInfo.city_id || data.cityId || data.cityId,
      city_id: location.city?.id || data.city_id || basicInfo.city_id || data.cityId || data.cityId,
      latitude: location.coordinates?.latitude || data.latitude || '18.5204',
      longitude: location.coordinates?.longitude || data.longitude || '73.8567',
      adult_price: packages.pricing?.adult || data.adult_price || basicInfo.price || 0,
      child_price: packages.pricing?.child || data.child_price || 0,
      capacity: basicInfo.capacity || data.capacity || 2,
      availableRooms: basicInfo.rooms || data.rooms || 1,
      features: features,
      detailedInfo: data.detailed_info ? (typeof data.detailed_info === 'string' ? JSON.parse(data.detailed_info) : data.detailed_info) : {},
      images: accommodationImages.length > 0 ? accommodationImages : [],
      rooms: basicInfo.rooms || data.rooms || 1,
      available: true,
      MaxPersonVilla: basicInfo.maxPerson || data.MaxPersonVilla,
      RatePerPerson: basicInfo.ratePerPerson || data.RatePersonVilla,
    };
  },

  // Gallery
  async getGalleryImages(): Promise<GalleryImage[]> {
    const response = await fetch(`${API_BASE_URL}/admin/gallery`);
    if (!response.ok) throw new Error('Failed to fetch images');
    
    const responseData = await response.json();
    let data: GalleryImage[] = responseData.images || responseData;
    
    return data.map((img: any) => ({
      id: img.id,
      url: img.image_url || img.src || img.url,
      alt: img.alt_text || img.alt || '',
      category: img.category || 'uncategorized',
      source: 'backend'
    }));
  },

  // Cities/Locations
  async getCities(): Promise<City[]> {
    const response = await fetch(`${API_BASE_URL}/admin/cities`);
    if (!response.ok) throw new Error('Failed to fetch cities');
    const data = await response.json();
    // Handle response structure: {success: true, data: [...]}
    if (data.success && Array.isArray(data.data)) {
      return data.data;
    }
    // Fallback for different response structures
    return Array.isArray(data) ? data : (data.data || []);
  },

  // Availability
  async checkAvailability(id: number, dates: string[]): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/admin/bookings/multi-date-availability?dates=${dates.join(',')}&id=${id}`
    );
    if (!response.ok) throw new Error('Failed to check availability');
    return response.json();
  },

  async getBlockedDates(id: number): Promise<any[]> {
    const res = await fetch(`${API_BASE_URL}/admin/calendar/blocked-dates/${id}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  },

  // Coupons
  async getCoupons(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/admin/coupons`);
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  },

  // Booking
  async createBooking(payload: BookingPayload): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create booking');
    }
    
    return response.json();
  },
};
