import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LocationCards from "@/components/LocationCards";
import SearchFilters from "@/components/SearchFilters";
import PropertiesSection from "@/components/PropertiesSection";
import EventsSection from "@/components/EventsSection";
import GalleryPreview from "@/components/GalleryPreview";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
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
    </div>
  );
};

export default Index;
