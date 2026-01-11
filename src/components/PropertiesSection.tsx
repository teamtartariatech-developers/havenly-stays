import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Users, Wifi, Car, Heart, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api, Accommodation } from "@/services/api";

const PropertiesSection = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await api.getProperties();
        setProperties(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <section id="properties" className="pb-16 md:pb-24 pt-6 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading properties...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="properties" className="pb-16 md:pb-24 pt-6 bg-section-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <p className="text-destructive mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="properties" className="pb-16 md:pb-24 pt-6 bg-section-gradient">
      <div className="container mx-auto px-4">
        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => {
            const mainImage = Array.isArray(property.images) && property.images.length > 0 
              ? property.images[0] 
              : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop";
            
            return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500">
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={mainImage}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-foreground">{property.type}</span>
                  </div>

                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-5 h-5 text-foreground" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.address || 'Location'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {property.name}
                  </h3>

                  {/* Amenities */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{property.capacity} guests</span>
                    </div>
                    {property.features?.some((f: string) => f.toLowerCase().includes('wifi')) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm">WiFi</span>
                      </div>
                    )}
                    {property.features?.some((f: string) => f.toLowerCase().includes('parking')) && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Car className="w-4 h-4" />
                        <span className="text-sm">Parking</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-foreground">₹{property.price || property.adult_price || 0}</span>
                      <span className="text-muted-foreground text-sm"> / night</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/book/${property.id}`)}
                      className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all"
          >
            View All Properties
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertiesSection;
