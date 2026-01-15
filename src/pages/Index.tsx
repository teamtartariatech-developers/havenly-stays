import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LocationCards from "@/components/LocationCards";
import SearchFilters from "@/components/SearchFilters";
import PropertiesSection from "@/components/PropertiesSection";
import EventsSection from "@/components/EventsSection";
import GalleryPreview from "@/components/GalleryPreview";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import FloatingContactButtons from "@/components/FloatingContactButtons";
import { updatePageMeta } from "@/utils/seo";

const Index = () => {
  useEffect(() => {
    const canonical = `${window.location.origin}/`;
    updatePageMeta({
      title: "Havenly Stays | Lakeside Resorts & Luxury Villas at Pawna Lake",
      description:
        "Book premium cottages, villas, and camps near Pawna Lake. Explore scenic stays, curated experiences, and easy online booking with Havenly Stays.",
      canonical,
      ogImage:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=630&fit=crop",
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <LocationCards />
      <SearchFilters />
      <PropertiesSection />
      <EventsSection />
      <GalleryPreview />
      <ReviewsSection />
      <Footer />
      <FloatingContactButtons />
    </div>
  );
};

export default Index;
