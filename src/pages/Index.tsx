import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LocationCards from "@/components/LocationCards";
import AdvertisementsSection from "@/components/AdvertisementsSection";
import SearchFilters from "@/components/SearchFilters";
import PropertiesSection from "@/components/PropertiesSection";
import ServiceSection from "@/components/ServiceSection";
import EventsSection from "@/components/EventsSection";
import GalleryPreview from "@/components/GalleryPreview";
import ReviewsSection from "@/components/ReviewsSection";
import InstagramShowcase from "@/components/InstagramShowcase";
import Footer from "@/components/Footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { updatePageMeta } from "@/utils/seo";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);

  useEffect(() => {
    const canonical = `${window.location.origin}/`;
    updatePageMeta({
      title: "Pavana Agro Tourism | Lakeside Resorts & Luxury Villas at Pawna Lake",
      description:
        "Book premium cottages, villas, and camps near Pawna Lake. Explore scenic stays, curated experiences, and easy online booking with Pavana Agro Tourism.",
      canonical,
      ogImage:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=630&fit=crop",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AdvertisementsSection />
      <LocationCards />
      <SearchFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeType={activeType}
        setActiveType={setActiveType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        amenitiesFilter={amenitiesFilter}
        setAmenitiesFilter={setAmenitiesFilter}
      />
      <PropertiesSection
        searchQuery={searchQuery}
        activeType={activeType}
        priceRange={priceRange}
        amenitiesFilter={amenitiesFilter}
      />
      <ServiceSection />
      <EventsSection />
      <GalleryPreview />
      <ReviewsSection />
      <InstagramShowcase />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
};

export default Index;
