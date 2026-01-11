import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { api, City } from "@/services/api";

const defaultImages = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=500&fit=crop",
];

const LocationCards = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await api.getCities();
        setCities(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('Failed to load locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return (
    <section id="locations" className="py-16 md:py-24 bg-subtle-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Explore</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Discover Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your perfect getaway in our handpicked locations, each offering unique experiences.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading locations...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Horizontal Scroll Container */}
        {!loading && !error && (
          <div className="relative -mx-4 px-4">
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
              {cities.length > 0 ? cities.map((city, index) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px] md:w-[320px] snap-center"
              >
                <div className="group relative rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 cursor-pointer h-[200px] md:h-[225px]">
                  <img
                    src={defaultImages[index % defaultImages.length]}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-white/80 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{city.state}</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">
                      {city.name}
                    </h3>
                    <p className="text-white/70 text-sm mb-4">{city.country}</p>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
              )) : (
                <div className="text-center py-20 w-full">
                  <p className="text-muted-foreground">No locations available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LocationCards;
