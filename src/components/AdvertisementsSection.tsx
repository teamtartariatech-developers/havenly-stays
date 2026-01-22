import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdvertisementsSection = () => {
  // Sample advertisement data - this would come from an API in production
  const advertisements = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=400&fit=crop",
      title: "Special Weekend Getaway",
      subtitle: "Book now and get 20% off",
      description: "Escape to paradise with our exclusive weekend packages"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
      title: "Family Package Deal",
      subtitle: "Perfect for family vacations",
      description: "Create unforgettable memories with your loved ones"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=400&fit=crop",
      title: "Adventure Activities",
      subtitle: "Thrilling experiences await",
      description: "Explore nature with our guided adventure tours"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=400&fit=crop",
      title: "Romantic Retreat",
      subtitle: "Perfect for couples",
      description: "Intimate stays with breathtaking lake views"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % advertisements.length);
    }, 5000); // Slightly longer for mobile

    return () => clearInterval(timer);
  }, [advertisements.length, isAutoPlaying]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + advertisements.length) % advertisements.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              Special Offers &{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
                Promotions
              </span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Discover our latest deals and exclusive packages</p>
          </div>

          {/* Carousel Container */}
          <div
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl bg-gradient-to-r from-green-50 to-blue-50"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative h-64 sm:h-80 md:h-96">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full">
                    {/* Background Image */}
                    <img
                      src={advertisements[currentIndex].image}
                      alt={advertisements[currentIndex].title}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="container mx-auto px-4 sm:px-6 md:px-12">
                        <div className="max-w-sm sm:max-w-md md:max-w-lg">
                          <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight"
                          >
                            {advertisements[currentIndex].title}
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg sm:text-xl font-semibold text-orange-300 mb-2 sm:mb-3"
                          >
                            {advertisements[currentIndex].subtitle}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-white/90 text-sm sm:text-base md:text-lg leading-relaxed"
                          >
                            {advertisements[currentIndex].description}
                          </motion.p>
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-4 sm:mt-6 bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Learn More
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Larger touch targets for mobile */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
              aria-label="Previous advertisement"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 touch-manipulation"
              aria-label="Next advertisement"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots Indicator - Larger touch targets for mobile */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 touch-manipulation ${
                    index === currentIndex
                      ? "bg-orange-400 scale-125"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to advertisement ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisementsSection;