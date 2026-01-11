import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const galleryImages = [
  { id: 1, src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop", alt: "Resort Pool", category: "Amenities" },
  { id: 2, src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=800&fit=crop", alt: "Luxury Suite", category: "Rooms" },
  { id: 3, src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop", alt: "Restaurant", category: "Dining" },
  { id: 4, src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=600&fit=crop", alt: "Spa", category: "Wellness" },
  { id: 5, src: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=600&h=400&fit=crop", alt: "Beach View", category: "Views" },
  { id: 6, src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&h=600&fit=crop", alt: "Garden", category: "Outdoors" },
  { id: 7, src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=800&fit=crop", alt: "Villa Exterior", category: "Properties" },
  { id: 8, src: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&h=400&fit=crop", alt: "Cottage Interior", category: "Rooms" },
  { id: 9, src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=500&fit=crop", alt: "Beach House", category: "Properties" },
  { id: 10, src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop", alt: "Yoga Session", category: "Activities" },
  { id: 11, src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=600&fit=crop", alt: "Fine Dining", category: "Dining" },
  { id: 12, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop", alt: "Mountain View", category: "Views" },
  { id: 13, src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=500&fit=crop", alt: "Private Beach", category: "Outdoors" },
  { id: 14, src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=800&fit=crop", alt: "Bedroom Suite", category: "Rooms" },
  { id: 15, src: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop", alt: "Mountain Cabin", category: "Properties" },
  { id: 16, src: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&h=600&fit=crop", alt: "Adventure", category: "Activities" },
];

const categories = ["All", "Properties", "Rooms", "Dining", "Views", "Wellness", "Activities", "Outdoors", "Amenities"];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

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

      {/* Pinterest-style Masonry Grid */}
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
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="inline-block bg-white/90 text-foreground px-3 py-1 rounded-full text-xs font-medium">
                        {image.category}
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
              src={selectedImage.src.replace("w=600", "w=1200")}
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
