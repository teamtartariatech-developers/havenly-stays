import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { api, GalleryImage } from "@/services/api";

const Gallery = () => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const images = await api.getGalleryImages();
        setGalleryImages(images);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery images:', err);
        setError('Failed to load gallery images. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Get unique categories from images
  const categories = ["All", ...Array.from(new Set(galleryImages.map(img => img.category || 'uncategorized')))];
  
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => (img.category || 'uncategorized').toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            A visual journey through our stunning properties and experiences.
          </motion.p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 sticky top-16 md:top-20 z-40 glass-effect">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading gallery...</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Error State */}
      {error && !loading && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
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
      )}

      {/* Pinterest-style Masonry Grid */}
      {!loading && !error && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.03 }}
                  className="mb-4 md:mb-6 break-inside-avoid"
                >
                  <div
                    className="group relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-card hover:shadow-elevated transition-all"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-block bg-white/90 text-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {image.category || 'uncategorized'}
                      </span>
                      <p className="text-white font-medium mt-2">{image.alt}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Gallery;
