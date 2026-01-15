import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  X,
  User,
  Mail,
  Phone,
  UtensilsCrossed,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api, Accommodation } from "@/services/api";
import { initiatePayment, handlePaymentRedirect } from "@/utils/payment";
import { updatePageMeta } from "@/utils/seo";
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

interface Coupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percentage';
  discount: string;
  minAmount: string;
  maxDiscount?: string | null;
  expiryDate: string;
  active: number;
  accommodationType: string;
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
  const [minAvailableRooms, setMinAvailableRooms] = useState<number | null>(null);
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
  
  // Coupon State
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [allAvailableCoupons, setAllAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  
  const getDateStringsInRange = (start: Date, end: Date) => {
    const dates: string[] = [];
    let current = new Date(start);
    current.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(0, 0, 0, 0);

    while (current < endDate) {
      dates.push(format(current, "yyyy-MM-dd"));
      current = addDays(current, 1);
    }
    return dates;
  };
  
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

  useEffect(() => {
    if (!property) return;
    const canonical = `${window.location.origin}/book/${property.id}`;
    updatePageMeta({
      title: `${property.name} | Book Your Stay - Havenly Stays`,
      description:
        property.description ||
        `Reserve ${property.name} at Pawna Lake. Explore amenities, pricing, and availability to plan your stay.`,
      canonical,
      ogImage:
        property.images?.[0] ||
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=630&fit=crop",
    });
  }, [property]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!property || !dateRange?.from || !dateRange?.to) {
        setMinAvailableRooms(null);
        return;
      }
      const dates = getDateStringsInRange(dateRange.from, dateRange.to);
      if (dates.length === 0) {
        setMinAvailableRooms(null);
        return;
      }
      try {
        const availability = await api.checkAvailability(property.id, dates);
        setMinAvailableRooms(
          typeof availability?.min_available_rooms === "number"
            ? availability.min_available_rooms
            : null
        );
      } catch (error) {
        console.error("Error checking availability:", error);
        setMinAvailableRooms(null);
      }
    };

    fetchAvailability();
  }, [property, dateRange?.from, dateRange?.to]);

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const coupons = await api.getCoupons();
        const currentDate = new Date();
        const activeCoupons = coupons.filter((coupon: Coupon) =>
          coupon.active === 1 && new Date(coupon.expiryDate) > currentDate
        );
        setAllAvailableCoupons(activeCoupons);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

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

  // Calculate totals - must be before early returns
  const totalAdults = roomGuests.reduce((sum, r) => sum + r.adults, 0);
  const totalChildren = roomGuests.reduce((sum, r) => sum + r.children, 0);
  const totalGuests = totalAdults + totalChildren;
  const maxRoomsForSelection = Math.max(
    1,
    Math.min(property?.rooms || 5, minAvailableRooms ?? (property?.rooms || 5))
  );

  // Calculate discount when coupon is applied
  // Note: This must be before early returns to follow Rules of Hooks
  useEffect(() => {
    if (!couponApplied || !appliedCoupon || !dateRange?.from || !dateRange?.to || !property) {
      setDiscount(0);
      return;
    }

    const nights = differenceInDays(dateRange.to, dateRange.from);
    if (nights === 0) {
      setDiscount(0);
      return;
    }

    const pricePerNight = property.adult_price || property.price || 0;
    const childPrice = property.child_price || 0;
    const currentSubtotal = (totalAdults * pricePerNight + totalChildren * childPrice) * nights;

    if (currentSubtotal < parseFloat(appliedCoupon.minAmount)) {
      setDiscount(0);
      setCouponApplied(false);
      setAppliedCoupon(null);
      setCoupon('');
      setCouponError(`Minimum amount for this coupon is ₹${appliedCoupon.minAmount}`);
      return;
    }

    let calculatedDiscount = 0;
    if (appliedCoupon.discountType === 'fixed') {
      calculatedDiscount = parseFloat(appliedCoupon.discount);
    } else if (appliedCoupon.discountType === 'percentage') {
      const percent = parseFloat(appliedCoupon.discount);
      calculatedDiscount = (currentSubtotal * percent) / 100;
      if (appliedCoupon.maxDiscount) {
        const maxAllowed = parseFloat(appliedCoupon.maxDiscount);
        calculatedDiscount = Math.min(calculatedDiscount, maxAllowed);
      }
    }

    const finalDiscount = Math.min(calculatedDiscount, currentSubtotal);
    setDiscount(finalDiscount);
  }, [couponApplied, appliedCoupon, totalAdults, totalChildren, property, dateRange, roomGuests]);

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

  const handleRoomsChange = (newRooms: number) => {
    const propertyRooms = property?.rooms || 5;
    const availabilityCap = minAvailableRooms ?? propertyRooms;
    const maxRooms = Math.max(1, Math.min(propertyRooms, availabilityCap));
    const validRooms = Math.max(1, Math.min(newRooms, maxRooms));
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
  const totalBeforeDiscount = subtotal + serviceFee;
  const total = Math.max(0, totalBeforeDiscount - discount);
  const advanceAmount = Math.round(total * 0.3); // 30% advance

  const handleApplyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponError('');

    if (!code) {
      setCouponError('Please enter a coupon code');
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      setCouponError('Please select dates first');
      return;
    }

    try {
      const foundCoupon = allAvailableCoupons.find(
        (c: Coupon) => c.code.toUpperCase() === code
      );

      if (!foundCoupon) {
        setCouponError('Invalid coupon code');
        return;
      }

      if (foundCoupon.active !== 1) {
        setCouponError('This coupon is no longer active');
        return;
      }

      const now = new Date();
      const expiryDate = new Date(foundCoupon.expiryDate);
      if (expiryDate < now) {
        setCouponError('This coupon has expired');
        return;
      }

      const couponAccommodationType = foundCoupon.accommodationType?.trim() || '';
      const currentAccommodationName = property?.name?.trim() || '';

      if (couponAccommodationType.toLowerCase() !== 'all' &&
        couponAccommodationType !== currentAccommodationName) {
        setCouponError('This coupon is not valid for this accommodation');
        return;
      }

      if (subtotal < parseFloat(foundCoupon.minAmount)) {
        setCouponError(`Minimum amount for this coupon is ₹${foundCoupon.minAmount}`);
        return;
      }

      setAppliedCoupon(foundCoupon);
      setCoupon(code);
      setCouponApplied(true);
      setCouponError('');
      
      toast({
        title: "Coupon Applied!",
        description: `Discount of ₹${foundCoupon.discountType === 'fixed' ? foundCoupon.discount : foundCoupon.discount + '%'} applied successfully.`,
      });

    } catch (error: any) {
      console.error('Coupon application error:', error);
      setCouponError(error.message || 'Failed to apply coupon');
      setDiscount(0);
      setCouponApplied(false);
      setAppliedCoupon(null);
    }
  };

  const handleCouponSelect = (selectedCoupon: Coupon) => {
    setCoupon(selectedCoupon.code);
    setCouponError('');
  };

  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Select Dates",
        description: "Please select your check-in and check-out dates.",
        variant: "destructive"
      });
      return;
    }

    if (minAvailableRooms !== null && rooms > minAvailableRooms) {
      toast({
        title: "Limited Availability",
        description: `Only ${minAvailableRooms} room(s) available for selected dates.`,
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
        package_id: 0,
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
        coupon_code: couponApplied ? coupon : undefined,
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

  const handleDownloadPdf = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Select Dates",
        description: "Please select your check-in and check-out dates first.",
        variant: "destructive",
      });
      return;
    }

    if (!property) return;

    const bookingDate = format(new Date(), "yyyy-MM-dd");
    const bookingId = `PREVIEW-${property.id}`;
    const checkInDate = format(dateRange.from, "yyyy-MM-dd");
    const checkOutDate = format(dateRange.to, "yyyy-MM-dd");
    const fullAmount = totalBeforeDiscount;

    const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body { margin: 0; padding: 0; background: #f5f7f9; font-family: "Lato", Arial, sans-serif; color: #1f2933; }
      .container { max-width: 680px; margin: 0 auto; background: #ffffff; }
      .header { background: #0f6f5c; color: #ffffff; padding: 28px 32px; }
      .header h1 { margin: 0; font-size: 22px; font-weight: 700; }
      .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; }
      .section { padding: 24px 32px; }
      .title { font-size: 18px; margin: 0 0 8px; }
      .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; }
      .grid { width: 100%; border-collapse: collapse; }
      .grid td { padding: 4px 0; font-size: 13px; }
      .divider { height: 1px; background: #e5e7eb; margin: 16px 0; }
      .badge { display: inline-block; background: #e6f4ef; color: #0f6f5c; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; }
      .footer { background: #0f172a; color: #e2e8f0; padding: 20px 32px; font-size: 12px; }
      .link { color: #0f6f5c; text-decoration: none; }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7f9;">
      <tr>
        <td>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="container">
            <tr>
              <td class="header">
                <h1>${property.name}</h1>
                <p>Booking ID: <strong>${bookingId}</strong> | Booking Date: ${bookingDate}</p>
              </td>
            </tr>
            <tr>
              <td class="section">
                <p><strong>Dear ${formData.name || "Guest"},</strong></p>
                <p style="margin: 8px 0 0;">
                  ${property.name} has received a request for booking as per the details below. The
                  primary guest ${formData.name || "Guest"} will be carrying a copy of this e-voucher.
                </p>
                <p style="margin: 8px 0 0;">For your reference, Booking ID is <strong>${bookingId}</strong>.</p>
                <p style="margin: 8px 0 0;">
                  <strong>The amount payable to ${property.name} for this booking is INR ${advanceAmount}. Please email us at
                  <a class="link" href="mailto:campatpawna@gmail.com">campatpawna@gmail.com</a> if there is any discrepancy in this payment amount.</strong>
                </p>
                <p style="margin: 12px 0 0;">Kindly consider this e-voucher for booking confirmation with the following inclusions and services.</p>
                <div style="margin-top: 12px;"><span class="badge">All prices indicated below are in INR</span></div>
              </td>
            </tr>
            <tr>
              <td class="section">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="50%" style="padding-right: 8px;">
                      <div class="card">
                        <h3 class="title">Booking Details</h3>
                        <table class="grid">
                          <tr><td>Mobile:</td><td><strong>${formData.phone || "-"}</strong></td></tr>
                          <tr><td>Check In:</td><td><strong>${checkInDate}</strong></td></tr>
                          <tr><td>Check Out:</td><td><strong>${checkOutDate}</strong></td></tr>
                          <tr><td>Total Person:</td><td><strong>${totalGuests}</strong></td></tr>
                          <tr><td>Adult:</td><td><strong>${totalAdults}</strong></td></tr>
                          <tr><td>Child:</td><td><strong>${totalChildren}</strong></td></tr>
                          <tr><td>Rooms:</td><td><strong>${rooms}</strong></td></tr>
                          <tr><td>Veg Count:</td><td><strong>${foodCounts.veg}</strong></td></tr>
                          <tr><td>Non Veg Count:</td><td><strong>${foodCounts.nonveg}</strong></td></tr>
                          <tr><td>Jain Count:</td><td><strong>${foodCounts.jain}</strong></td></tr>
                        </table>
                      </div>
                    </td>
                    <td width="50%" style="padding-left: 8px;">
                      <div class="card">
                        <h3 class="title">Payment Breakup</h3>
                        <table class="grid">
                          <tr><td>Full Amount:</td><td><strong>${fullAmount}</strong></td></tr>
                          <tr><td>Discount:</td><td><strong>${discount}</strong></td></tr>
                          <tr><td>Coupon:</td><td><strong>${coupon || "-"}</strong></td></tr>
                          <tr><td>Total Amount:</td><td><strong>${total}</strong></td></tr>
                          <tr><td>Advance Amount:</td><td><strong>${advanceAmount}</strong></td></tr>
                          <tr><td>Remaining Amount:</td><td><strong>${total - advanceAmount}</strong></td></tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
                <div class="divider"></div>
                <p><strong>Booking Cancellation Policy:</strong> From >${bookingDate},100% penalty will be charged. In case of no show : no refund.Booking cannot be cancelled/modified on or after the booking date and time mentioned in the Camping Confirmation Voucher. All time mentioned above is in destination time.</p>
                <div class="divider"></div>
                <p><strong>Note</strong></p>
                <p>If your contact details have changed, please notify us so that the same can be updated in our records.</p>
                <p style="margin-top: 8px;">If the booking is cancelled or changed by guest at a later stage, you will be notified and this confirmation email & Nirwana Stays Booking ID will be null and void.</p>
              </td>
            </tr>
            <tr>
              <td class="section">
                <h3 class="title">${property.name} Contact Info</h3>
                <div class="card">
                  <p><strong>${property.name}</strong></p>
                  <p>At- ${property.address || "Pawna Lake"}</p>
                  <p>pawna lake</p>
                  <p><a class="link" href="http://maps.google.com/maps?q=${property.latitude},${property.longitude}">Google Maps Link</a></p>
                  <div class="divider"></div>
                  <p><strong>Email - </strong><a class="link" href="mailto:campatpawna@gmail.com">campatpawna@gmail.com</a></p>
                  <p><strong>Contact Number - </strong>Tushar Thakar - 9175106307</p>
                </div>
                <div class="divider"></div>
                <p><strong>Note</strong> - Please do not reply to this email. It has been sent from an email account that is not monitored. To ensure that you receive communication related to your booking from Nirwana Stays , please add <a class="link" href="mailto:bookings@nirwanastays.com"><strong>bookings@nirwanastays.com</strong></a> to your contact list and address book.</p>
                <div class="divider"></div>
                <h3 class="title">Things to Carry</h3>
                <p>• Always good to carry extra pair of clothes<br />
                  • Winter and warm clothes as it will be cold night<br />
                  • Toothbrush and paste (toiletries)<br />
                  • Any other things you feel necessary<br />
                  • Personal medicine if any</p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                Team ${property.name} | Thank you for choosing us.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "absolute";
    container.style.top = "-9999px";
    container.style.left = "-9999px";
    container.style.width = "794px";
    container.style.background = "white";
    container.style.padding = "0";
    container.style.margin = "0";
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(container, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 595.28;
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;
      const pdf = new jsPDF("p", "pt", [pdfWidth, pdfHeight]);
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Booking-${bookingId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({
        title: "PDF Failed",
        description: "Unable to generate the booking PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      document.body.removeChild(container);
    }
  };

  const images = property.images && property.images.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop"];

  const supportPhone = "+919226869678";
  const stayRangeText =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd MMM yyyy")} to ${format(dateRange.to, "dd MMM yyyy")}`
      : "my preferred dates";
  const whatsappMessage = `Hi, I would like to enquire about ${property.name}. I am planning a stay from ${stayRangeText}. Please share availability and best offers.`;
  const whatsappLink = `https://wa.me/919226869678?text=${encodeURIComponent(whatsappMessage)}`;

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
              className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-50/50 p-6 md:p-8 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Guest Details</h2>
                    <p className="text-gray-500 text-sm">Who should we send the booking details to?</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 space-y-8">
                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium ml-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        className="pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 bg-gray-50/30 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium ml-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 bg-gray-50/30 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-gray-700 font-medium ml-1">Phone Number</Label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+91 98765 43210" 
                        className="pl-12 rounded-xl border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 bg-gray-50/30 transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <Separator />
                
                {/* Room Configuration */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Room Configuration</h3>
                      <p className="text-sm text-gray-500">Customize guests per room</p>
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => handleRoomsChange(rooms - 1)}
                        disabled={rooms <= 1}
                        className="w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
                      >
                        <span className="text-lg font-medium leading-none mb-0.5">−</span>
                      </button>
                      <span className="text-base font-bold text-gray-900 w-16 text-center">{rooms} Room{rooms > 1 ? 's' : ''}</span>
                      <button
                        type="button"
                        onClick={() => handleRoomsChange(rooms + 1)}
                        disabled={rooms >= maxRoomsForSelection}
                        className="w-9 h-9 rounded-lg bg-white shadow-sm border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary hover:border-primary transition-all disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600"
                      >
                        <span className="text-lg font-medium leading-none mb-0.5">+</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {roomGuests.slice(0, rooms).map((room, idx) => (
                      <motion.div 
                        key={`room-${idx}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border border-gray-100 rounded-2xl p-4 hover:border-primary/30 hover:shadow-md transition-all bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                              {idx + 1}
                            </div>
                            <span className="font-semibold text-gray-700">Room {idx + 1}</span>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            {/* Adults Control */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Adults</span>
                              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'adults', room.adults - 1)}
                                  disabled={room.adults <= 1}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40"
                                >
                                  −
                                </button>
                                <span className="font-bold text-gray-900 w-4 text-center">{room.adults}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'adults', room.adults + 1)}
                                  disabled={room.adults + room.children >= (property?.capacity || 4)}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Divider */}
                            <div className="w-px h-10 bg-gray-100 hidden sm:block" />

                            {/* Children Control */}
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Children</span>
                              <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'children', room.children - 1)}
                                  disabled={room.children <= 0}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40"
                                >
                                  −
                                </button>
                                <span className="font-bold text-gray-900 w-4 text-center">{room.children}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRoomGuestChange(idx, 'children', room.children + 1)}
                                  disabled={room.adults + room.children >= (property?.capacity || 4)}
                                  className="w-8 h-8 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 transition-all disabled:opacity-40"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Food Preferences - Compact Green Theme */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Meal Preferences</h3>
                      <p className="text-sm text-gray-500">Select dietary requirements</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                       <UtensilsCrossed className="w-4 h-4 text-primary" />
                       <span className={`text-sm font-semibold ${
                          (foodCounts.veg + foodCounts.nonveg + foodCounts.jain) === totalGuests 
                            ? 'text-primary' 
                            : 'text-orange-600'
                        }`}>
                          {foodCounts.veg + foodCounts.nonveg + foodCounts.jain} / {totalGuests}
                        </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
                    {(['veg', 'nonveg', 'jain'] as const).map((type) => (
                      <div key={type} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            type === 'veg' ? 'bg-green-600' : 
                            type === 'nonveg' ? 'bg-red-600' : 
                            'bg-orange-500'
                          }`} />
                          <span className="font-semibold text-gray-700 capitalize">
                            {type === 'nonveg' ? 'Non-Veg' : type}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleFoodCount(type, -1)}
                            disabled={foodCounts[type] <= 0}
                            className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-primary hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="pb-0.5 text-lg">−</span>
                          </button>
                          <span className="font-bold text-gray-900 w-5 text-center">{foodCounts[type]}</span>
                          <button
                            type="button"
                            onClick={() => handleFoodCount(type, 1)}
                            disabled={(foodCounts.veg + foodCounts.nonveg + foodCounts.jain) >= totalGuests}
                            className="w-8 h-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-primary hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <span className="pb-0.5 text-lg">+</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                   <div className="mt-2 text-right">
                      <p className="text-xs text-gray-400">
                        Total guests: {totalGuests}
                      </p>
                    </div>
                </div>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="requests" className="text-gray-700 font-medium ml-1">Special Requests</Label>
                  <textarea 
                    id="requests" 
                    className="w-full min-h-[100px] rounded-xl border border-gray-200 bg-white p-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-sm placeholder:text-gray-400"
                    placeholder="Any dietary requirements, allergies, or special occasions?"
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                  />
                </div>
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
              {dateRange?.from && dateRange?.to && minAvailableRooms !== null && (
                <p className="mt-4 text-center text-sm text-gray-500">
                  Minimum {minAvailableRooms} room(s) available for selected dates.
                </p>
              )}
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
                    <span className="text-gray-600">Service Fee (5%)</span>
                    <span className="font-medium text-gray-900">₹{serviceFee}</span>
                  </div>
                  
                  {/* Coupon Section */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    {allAvailableCoupons.length > 0 && (
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-500 mb-2">
                          Available Offers
                        </label>
                        <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
                          {(() => {
                            const accommodationCoupons = allAvailableCoupons.filter(
                              (c: Coupon) => c.accommodationType?.trim() === property?.name?.trim()
                            );
                            const allTypeCoupons = allAvailableCoupons.filter(
                              (c: Coupon) => c.accommodationType?.trim().toLowerCase() === "all"
                            );
                            const couponsToShow = [...accommodationCoupons, ...allTypeCoupons.filter(ac => !accommodationCoupons.find(sc => sc.id === ac.id))].slice(0, 4);

                            return couponsToShow.map((couponItem: Coupon) => (
                              <button
                                key={couponItem.code}
                                onClick={() => handleCouponSelect(couponItem)}
                                className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-primary rounded-full text-xs font-medium hover:bg-green-100 transition-colors whitespace-nowrap border border-green-100"
                              >
                                {couponItem.code}
                              </button>
                            ));
                          })()}
                        </div>
                      </div>
                    )}

                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon Code</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value);
                          setCouponApplied(false);
                          setDiscount(0);
                          setAppliedCoupon(null);
                          setCouponError('');
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                        placeholder="Enter coupon code"
                        disabled={couponApplied}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponApplied || !coupon.trim()}
                        className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {couponApplied ? 'Applied' : 'Apply'}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-red-600 mt-1.5">{couponError}</p>
                    )}
                    {couponApplied && appliedCoupon && (
                      <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-primary">
                            {appliedCoupon.code} Applied
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setCoupon('');
                              setCouponApplied(false);
                              setDiscount(0);
                              setAppliedCoupon(null);
                              setCouponError('');
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {appliedCoupon.discountType === 'fixed' 
                            ? `₹${appliedCoupon.discount} off`
                            : `${appliedCoupon.discount}% off`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-200 my-4" />

                <div className="space-y-4 mb-8">
                  {discount > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-₹{discount}</span>
                    </div>
                  )}
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadPdf}
                  className="w-full h-12 rounded-2xl border border-primary/20 text-primary hover:bg-primary/10 mt-3"
                >
                  Download Booking PDF
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

        {/* Contact Support */}
        <section className="mt-16">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-card p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need help with this stay?</h3>
              <p className="text-gray-600">
                Talk to our team for availability, custom offers, or special requests.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`tel:${supportPhone}`}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary/15 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call {supportPhone}
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#20c45e] transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
        </section>

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
