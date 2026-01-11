import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import { format, addDays, differenceInDays } from "date-fns";
import { 
  ChevronLeft, 
  MapPin, 
  Star, 
  Users, 
  Calendar as CalendarIcon, 
  CreditCard,
  Wifi,
  Car,
  Check,
  ChevronRight,
  Coffee,
  Tv,
  Utensils,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api, Accommodation } from "@/services/api";
import { initiatePayment, handlePaymentRedirect } from "@/utils/payment";
import { Loader2 } from "lucide-react";
import "react-day-picker/dist/style.css";

interface RoomGuest {
  adults: number;
  children: number;
}

interface FoodCounts {
  veg: number;
  nonveg: number;
  jain: number;
}

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [property, setProperty] = useState<Accommodation | null>(null);
  const [recommended, setRecommended] = useState<Accommodation[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to?: Date } | undefined>();
  const [rooms, setRooms] = useState(1);
  const [roomGuests, setRoomGuests] = useState<RoomGuest[]>([{ adults: 2, children: 0 }]);
  const [foodCounts, setFoodCounts] = useState<FoodCounts>({ veg: 2, nonveg: 0, jain: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  // Touch/swipe handlers for image gallery
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequests: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Fetch current property
        const data = await api.getProperty(Number(id));
        setProperty(data);
        // Initialize room guests
        setRoomGuests([{ adults: Math.min(2, data.capacity || 2), children: 0 }]);
        setFoodCounts({ veg: Math.min(2, data.capacity || 2), nonveg: 0, jain: 0 });

        // Fetch recommended properties
        const allProperties = await api.getProperties();
        const otherProperties = allProperties.filter(p => p.id !== Number(id));
        // Shuffle and take 3
        const randomRecommendations = otherProperties
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setRecommended(randomRecommendations);

      } catch (err) {
        console.error('Error fetching data:', err);
        toast({
          title: "Error",
          description: "Failed to load property details.",
          variant: "destructive"
        });
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, toast]);

  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Auto-advance carousel (disabled for manual scrolling)
  // useEffect(() => {
  //   if (!property?.images || property.images.length <= 1) return;
  //   const interval = setInterval(nextImage, 5000);
  //   return () => clearInterval(interval);
  // }, [property]);

  // Swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const lightboxNext = () => {
    if (!property?.images) return;
    setLightboxIndex((prev) => (prev + 1) % property.images.length);
  };

  const lightboxPrev = () => {
    if (!property?.images) return;
    setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen || !property?.images) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % property.images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, property?.images]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Property not found</h2>
          <Button onClick={() => navigate("/")} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const totalAdults = roomGuests.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;

  const handleRoomsChange = (newRooms: number) => {
    const validRooms = Math.max(1, Math.min(newRooms, property?.rooms || 5));
    setRooms(validRooms);
    
    setRoomGuests(prev => {
      let updated: RoomGuest[];
      if (validRooms > prev.length) {
        const newEntries = Array.from({ length: validRooms - prev.length }, () => ({
          adults: 2,
          children: 0
        }));
        updated = [...prev, ...newEntries];
      } else if (validRooms < prev.length) {
        updated = prev.slice(0, validRooms);
      } else {
        updated = prev;
      }
      
      // Update food counts to match new total guests
      const newTotalGuests = updated.reduce((sum, r) => sum + r.adults + r.children, 0);
      const currentFoodTotal = foodCounts.veg + foodCounts.nonveg + foodCounts.jain;
      
      if (currentFoodTotal > newTotalGuests) {
        // Scale down food counts proportionally
        const ratio = newTotalGuests / currentFoodTotal;
        setFoodCounts({
          veg: Math.max(0, Math.round(foodCounts.veg * ratio)),
          nonveg: Math.max(0, Math.round(foodCounts.nonveg * ratio)),
          jain: Math.max(0, Math.round(foodCounts.jain * ratio))
        });
      } else if (currentFoodTotal < newTotalGuests) {
        // Add remaining to veg by default
        const remaining = newTotalGuests - currentFoodTotal;
        setFoodCounts(prev => ({
          ...prev,
          veg: prev.veg + remaining
        }));
      }
      
      return updated;
    });
  };

  const handleRoomGuestChange = (index: number, type: 'adults' | 'children', value: number) => {
    const maxPeoplePerRoom = property?.capacity || 4;
    
    setRoomGuests(prev => {
      const newGuests = [...prev];
      const currentRoom = newGuests[index];
      
      let newValue = Math.max(0, value);
      if (type === 'adults') newValue = Math.max(1, newValue); // Min 1 adult per room

      const otherType = type === 'adults' ? 'children' : 'adults';
      const otherValue = currentRoom[otherType];

      if (newValue + otherValue > maxPeoplePerRoom) {
        // Allow change but cap it? Or prevent? 
        // Let's prevent exceeding max capacity
        return prev;
      }

      newGuests[index] = { ...currentRoom, [type]: newValue };
      return newGuests;
    });
  };

  const handleFoodCount = (type: keyof FoodCounts, delta: number) => {
    setFoodCounts(prev => {
      const newValue = Math.max(0, prev[type] + delta);
      const currentTotal = prev.veg + prev.nonveg + prev.jain;
      const newTotal = currentTotal - prev[type] + newValue;
      
      if (newTotal > totalGuests) return prev;
      
      return { ...prev, [type]: newValue };
    });
  };

  const pricePerNight = property?.adult_price || property?.price || 0;
  const childPrice = property?.child_price || 0;
  
  const nights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;

  // Calculate total based on per-person pricing if available
  const subtotal = (totalAdults * pricePerNight + totalChildren * childPrice) * nights;
  const serviceFee = Math.round(subtotal * 0.05); // 5% service fee
  const total = subtotal + serviceFee;
  const advanceAmount = Math.round(total * 0.3); // 30% advance

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Select Dates",
        description: "Please select your check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Validate food counts match total guests
    const totalFood = foodCounts.veg + foodCounts.nonveg + foodCounts.jain;
    if (totalFood !== totalGuests) {
      toast({
        title: "Food Preferences Error",
        description: `Food preferences (${totalFood}) must match total guests (${totalGuests}).`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create booking
      const bookingPayload = {
        accommodation_id: property.id,
        check_in: format(dateRange.from, 'yyyy-MM-dd'),
        check_out: format(dateRange.to, 'yyyy-MM-dd'),
        rooms: rooms,
        adults: totalAdults,
        children: totalChildren,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone,
        total_amount: total,
        advance_amount: advanceAmount,
        special_requests: formData.specialRequests || undefined,
        food_veg: foodCounts.veg,
        food_nonveg: foodCounts.nonveg,
        food_jain: foodCounts.jain,
      };

      const bookingResponse = await api.createBooking(bookingPayload);
      
      if (!bookingResponse.success && !bookingResponse.booking_id) {
        throw new Error(bookingResponse.error || 'Failed to create booking');
      }

      const bookingId = bookingResponse.booking_id || bookingResponse.id;

      // Initiate payment
      const paymentPayload = {
        amount: advanceAmount,
        firstname: formData.name.split(' ')[0] || formData.name,
        email: formData.email,
        phone: formData.phone,
        booking_id: bookingId,
        productinfo: `Booking for ${property.name}`,
      };

      const paymentResponse = await initiatePayment(paymentPayload);
      
      // Handle payment redirect
      handlePaymentRedirect(paymentResponse);
      
    } catch (error: any) {
      console.error("Booking error:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop"];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      {/* Hero Gallery Section - Swipeable */}
      <div 
        className="relative h-[60vh] lg:h-[70vh] w-full overflow-hidden bg-black cursor-pointer select-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => openLightbox(currentImageIndex)}
      >
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            src={images[currentImageIndex]} 
            alt={property.name} 
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </AnimatePresence>
        
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />
        
        {/* Navigation Controls */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            navigate(-1);
          }}
          className="absolute top-6 left-4 md:left-8 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all border border-white/20 group z-30"
        >
          <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Image Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-20">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Property Type and Location Tags on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pb-8">
          <div className="container mx-auto">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <span className="bg-primary/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase shadow-lg text-white">
                {property.type}
              </span>
              <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium text-white">
                <MapPin size={16} />
                {property.address || 'Scenic Location'}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Title and Description Section - Below Image */}
      <div className="container mx-auto px-4 pt-8 pb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-gray-900">
            {property.name}
          </h1>
          
          {/* Description with Show More */}
          {property.description && (
            <div className="mb-6">
              <div className={`text-gray-600 text-lg leading-relaxed ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                {property.description}
              </div>
              {property.description.length > 150 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-4 flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors group"
                >
                  {showFullDescription ? (
                    <>
                      <span>Show Less</span>
                      <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Rating and Price */}
          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 bg-yellow-50 px-4 py-2 rounded-full text-sm font-medium text-gray-900">
                <Star size={16} className="fill-yellow-400 text-yellow-400" /> 
                4.8 (128 reviews)
              </span>
            </div>
            <div className="text-right">
              <div className="flex items-baseline justify-end gap-2">
                <span className="text-3xl md:text-4xl font-bold text-gray-900">₹{pricePerNight}</span>
                <span className="text-gray-600 font-medium">/ night</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="container mx-auto px-4 mt-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Left Column: Details & Form */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Property Highlights */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100 mt-6"
            >
              <h3 className="text-xl font-bold mb-6 text-gray-900">Amenities & Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                    <Users size={20} />
                  </div>
                  <span className="text-sm font-medium">{property.capacity} Guests</span>
                </div>
                {property.features?.map((feature: string, i: number) => {
                  let Icon = Check;
                  const f = feature.toLowerCase();
                  if (f.includes('wifi')) Icon = Wifi;
                  else if (f.includes('parking')) Icon = Car;
                  else if (f.includes('breakfast') || f.includes('food')) Icon = Coffee;
                  else if (f.includes('tv')) Icon = Tv;
                  else if (f.includes('kitchen')) Icon = Utensils;
                  
                  return (
                    <div key={i} className="flex items-center gap-3 text-gray-600">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary">
                        <Icon size={20} />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Booking Form */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
                <div className="h-1 flex-1 bg-gray-100 ml-6 rounded-full" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="rounded-xl border-gray-200 focus:ring-primary focus:border-primary h-12 bg-gray-50/50"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    className="rounded-xl border-gray-200 focus:ring-primary focus:border-primary h-12 bg-gray-50/50"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+91 98765 43210" 
                    className="rounded-xl border-gray-200 focus:ring-primary focus:border-primary h-12 bg-gray-50/50"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Rooms & Guests Selection */}
              <div className="mt-8 space-y-8">
                {/* Room Selector - Minimalist */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-gray-900 font-semibold text-lg">Rooms</Label>
                    <p className="text-sm text-gray-500 font-light">Number of rooms required</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => handleRoomsChange(rooms - 1)}
                      disabled={rooms <= 1}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                    >
                      <span className="text-xl pb-1">−</span>
                    </button>
                    <span className="text-xl font-medium text-gray-900 w-4 text-center">{rooms}</span>
                    <button
                      type="button"
                      onClick={() => handleRoomsChange(rooms + 1)}
                      disabled={rooms >= (property?.rooms || 5)}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:hover:border-gray-200 disabled:cursor-not-allowed"
                    >
                      <span className="text-xl pb-1">+</span>
                    </button>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                {/* Room Guest Controllers - Compact Vertical */}
                {rooms > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-gray-900 font-semibold text-base">Guest Configuration</Label>
                      <span className="text-xs font-medium px-2 py-0.5 bg-green-50 text-green-700 rounded">
                        Max {property?.capacity || 4} / room
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {roomGuests.slice(0, rooms).map((room, idx) => (
                        <div key={`room-${idx}`} className="bg-white rounded-xl border border-green-100 overflow-hidden shadow-sm hover:shadow transition-shadow">
                          <div className="px-4 py-2 bg-green-50 border-b border-green-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Room {idx + 1}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          </div>
                          
                          <div className="p-3 space-y-2.5">
                            {/* Adults */}
                            <div className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
                                  <Users size={12} />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">Adults</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'adults', room.adults - 1)}
                                  disabled={room.adults <= 1}
                                  className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span className="pb-0.5 text-sm">−</span>
                                </button>
                                <span className="font-bold text-gray-900 w-3 text-center text-sm">{room.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'adults', room.adults + 1)}
                                  disabled={room.adults + room.children >= (property?.capacity || 4)}
                                  className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span className="pb-0.5 text-sm">+</span>
                                </button>
                              </div>
                            </div>

                            {/* Children */}
                            <div className="flex items-center justify-between bg-white border border-gray-200 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center flex-shrink-0">
                                  <Users size={12} />
                                </div>
                                <span className="text-gray-700 font-medium text-sm">Children</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'children', room.children - 1)}
                                  disabled={room.children <= 0}
                                  className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span className="pb-0.5 text-sm">−</span>
                                </button>
                                <span className="font-bold text-gray-900 w-3 text-center text-sm">{room.children}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'children', room.children + 1)}
                                  disabled={room.adults + room.children >= (property?.capacity || 4)}
                                  className="w-7 h-7 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <span className="pb-0.5 text-sm">+</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator className="bg-gray-100" />

                {/* Food Preferences - Vertical List Style */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-gray-900 font-semibold text-lg">Food Preferences</Label>
                    <div className={`text-xs px-2 py-1 rounded transition-colors ${
                      (foodCounts.veg + foodCounts.nonveg + foodCounts.jain) === totalGuests 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-orange-50 text-orange-700'
                    }`}>
                      {foodCounts.veg + foodCounts.nonveg + foodCounts.jain} / {totalGuests} selected
                    </div>
                  </div>

                  <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
                    {(['veg', 'nonveg', 'jain'] as const).map((type) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full ${
                            type === 'veg' ? 'bg-green-500' : 
                            type === 'nonveg' ? 'bg-red-500' : 
                            'bg-orange-500'
                          }`} />
                          <span className="font-medium text-gray-700 capitalize w-20">
                            {type === 'nonveg' ? 'Non-Veg' : type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <button
                            type="button"
                            onClick={() => handleFoodCount(type, -1)}
                            disabled={foodCounts[type] <= 0}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            <span className="pb-1 text-lg">−</span>
                          </button>
                          <span className="font-semibold text-gray-900 w-6 text-center">{foodCounts[type]}</span>
                          <button
                            type="button"
                            onClick={() => handleFoodCount(type, 1)}
                            disabled={(foodCounts.veg + foodCounts.nonveg + foodCounts.jain) >= totalGuests}
                            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-sm"
                          >
                            <span className="pb-1 text-lg">+</span>
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        {(foodCounts.veg + foodCounts.nonveg + foodCounts.jain) !== totalGuests ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            Please select preferences for all {totalGuests} guests
                          </>
                        ) : (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            All guests covered
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Label htmlFor="requests" className="text-gray-700 font-medium">Special Requests</Label>
                <textarea 
                  id="requests" 
                  className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-gray-50/50 p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  placeholder="Any dietary requirements or special occasions?"
                  value={formData.specialRequests}
                  onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                />
              </div>
            </motion.div>

            {/* Date Selection */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Select Dates</h2>
              <div className="flex justify-center">
                <DayPicker
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={window.innerWidth > 768 ? 2 : 1}
                  disabled={{ before: new Date() }}
                  className="border-0 p-0"
                  classNames={{
                    day_selected: "bg-primary text-white hover:bg-primary hover:text-white",
                    day_today: "font-bold text-primary",
                  }}
                />
              </div>
            </motion.div>
          </div>

          {/* Right Column: Order Summary (Sticky) */}
          <div className="lg:col-span-1">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="sticky top-24 space-y-6"
            >
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-elevated border border-gray-100 relative overflow-hidden">
                {/* Decorative background blob */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard size={16} />
                  </div>
                  Price Details
                </h3>
                
                <div className="space-y-4 mb-6 relative z-10">
                  <div className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-500 font-medium">Dates</span>
                    <span className="font-semibold text-gray-900">
                      {dateRange?.from ? format(dateRange.from, "MMM dd") : "Select"} 
                      {" - "} 
                      {dateRange?.to ? format(dateRange.to, "MMM dd") : "Select"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">₹{pricePerNight} x {nights} nights</span>
                    <span className="font-medium text-gray-900">₹{pricePerNight * nights}</span>
                  </div>
                  {rooms > 1 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">x {rooms} rooms</span>
                      <span className="font-medium text-gray-900">₹{subtotal}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Service Fee (10%)</span>
                    <span className="font-medium text-gray-900">₹{serviceFee}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4" />

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{total}</span>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-primary">Advance (30%)</span>
                      <span className="text-lg font-bold text-primary">₹{advanceAmount}</span>
                    </div>
                    <p className="text-xs text-primary/70">Pay remaining ₹{total - advanceAmount} at property</p>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  disabled={isLoading || !dateRange?.to}
                  className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] font-semibold"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
                
                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                  <Check size={12} /> Secure Payment Gateway
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Check, label: "Verified" },
                  { icon: Star, label: "Top Rated" },
                  { icon: Users, label: "24/7 Support" },
                ].map((badge, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 flex flex-col items-center justify-center gap-2 text-center shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                      <badge.icon size={16} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommended Stays */}
        {recommended.length > 0 && (
          <section className="mt-20 mb-12">
            <h2 className="text-3xl font-display font-bold mb-8 text-gray-900">You May Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommended.map((stay, index) => (
                <motion.div
                  key={stay.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/book/${stay.id}`)}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={Array.isArray(stay.images) && stay.images.length > 0 ? stay.images[0] : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"}
                      alt={stay.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-1 truncate">{stay.name}</h3>
                      <div className="flex items-center gap-1 text-sm opacity-90">
                        <MapPin size={14} />
                        <span className="truncate">{stay.address || 'Location'}</span>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      ₹{stay.adult_price || stay.price}/night
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxPrev();
                }}
                className="absolute left-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  lightboxNext();
                }}
                className="absolute right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={images[lightboxIndex]}
              alt={`${property.name} - Image ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium">
                {lightboxIndex + 1} / {images.length}
              </div>
            )}

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto scrollbar-hide px-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === lightboxIndex ? 'border-white scale-110' : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
