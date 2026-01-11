import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { api, Accommodation } from "@/services/api";

const HeroSection = () => {
  const [featuredProperties, setFeaturedProperties] = useState<Accommodation[]>([]);
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const properties = await api.getProperties();
        // Take first 3-5 properties for the carousel
        setFeaturedProperties(properties.slice(0, 5));
      } catch (err) {
        console.error('Error fetching properties for hero:', err);
      }
    };
    fetchProperties();
  }, []);

  // Auto-rotate properties carousel
  useEffect(() => {
    if (featuredProperties.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentPropertyIndex((prev) => (prev + 1) % featuredProperties.length);
    }, 3500); // Quick transition every 3.5 seconds

    return () => clearInterval(interval);
  }, [featuredProperties.length]);

  const currentProperty = featuredProperties[currentPropertyIndex];
  const propertyImage = currentProperty?.images?.[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=800&fit=crop";
  const propertyName = currentProperty?.name || "Luxury Resort";
  const propertyPrice = currentProperty?.adult_price || currentProperty?.price || 299;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden -mt-16 md:-mt-20">
      {/* Background Image/Gradient */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPropertyIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${propertyImage}')`
          }}
        />
      </AnimatePresence>
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 left-10 w-96 h-96 rounded-full bg-white/5 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white/90 text-sm font-medium">Award Winning Resort</span>
            </motion.div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
              Discover Your
              <span className="block text-white/80">Perfect Escape</span>
            </h1>

            <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8 font-light">
              Immerse yourself in nature's embrace. From luxury villas to cozy cottages, 
              find your sanctuary in the heart of paradise.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href="#properties"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 bg-white text-forest-700 px-8 py-4 rounded-full font-medium text-lg shadow-elevated hover:shadow-2xl transition-all"
              >
                Explore Stays
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#locations"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all"
              >
                <MapPin className="w-5 h-5" />
                View Locations
              </motion.a>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12">
              {[
                { value: "50+", label: "Properties" },
                { value: "12K+", label: "Happy Guests" },
                { value: "4.9", label: "Rating" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Hero Image Card with Property Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-elevated">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPropertyIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  src={propertyImage}
                  alt={propertyName}
                  className="w-full h-[500px] object-cover"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              
              {/* Floating Card with Property Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPropertyIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-6 left-6 right-6 glass-effect rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{propertyName}</p>
                      <p className="text-sm text-muted-foreground">Starting from ₹{propertyPrice}/night</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Carousel Indicators */}
              {featuredProperties.length > 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
                  {featuredProperties.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPropertyIndex(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentPropertyIndex 
                          ? 'bg-white w-6' 
                          : 'bg-white/50 w-1.5 hover:bg-white/70'
                      }`}
                      aria-label={`Go to property ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.9</div>
                <div className="flex gap-0.5 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
