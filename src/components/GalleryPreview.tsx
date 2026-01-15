import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/services/api";

const fallbackImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=500&fit=crop",
    alt: "Resort Pool",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
    alt: "Luxury Suite",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=500&fit=crop",
    alt: "Restaurant",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=400&fit=crop",
    alt: "Spa",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=400&h=300&fit=crop",
    alt: "Beach View",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=500&fit=crop",
    alt: "Garden",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400&h=300&fit=crop",
    alt: "Cozy Corner",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=400&h=400&fit=crop",
    alt: "Sunset View",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400&h=500&fit=crop",
    alt: "Mountain Trek",
  },
];

const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const GalleryPreview = () => {
  const [images, setImages] = useState(fallbackImages);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await api.getGalleryImages();
        if (data && data.length > 0) {
          // Shuffle API data
          const shuffledData = shuffleArray(data);
          
          // Map to required format
          const mapped = shuffledData.map((img, idx) => ({
            id: img.id || idx,
            src: img.url,
            alt: img.alt || 'Gallery Image',
          }));
          
          // Combine with shuffled fallback images if we don't have enough
          let combined = [...mapped];
          if (combined.length < 9) {
            const shuffledFallback = shuffleArray(fallbackImages);
            const needed = 9 - combined.length;
            const extras = shuffledFallback.slice(0, needed).map((img, idx) => ({
              ...img,
              id: `fallback-${idx}-${Date.now()}` // unique ids
            }));
            combined = [...combined, ...extras];
          }
          
          // Take exactly 9 images
          setImages(combined.slice(0, 9));
        } else {
            // Randomize fallback images on load
            setImages(shuffleArray(fallbackImages).slice(0, 9));
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
        // Randomize fallback images on error
        setImages(shuffleArray(fallbackImages).slice(0, 9));
      }
    };

    fetchImages();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Decorative background blobs */}
       <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider flex items-center gap-2">
              <Instagram className="w-4 h-4" />
              Follow Our Journey
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Visual Journey
            </h2>
          </div>
          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors bg-secondary/50 px-6 py-3 rounded-full"
            >
              View Full Gallery
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid relative group rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <Link to="/gallery">
                <div className={`relative w-full ${
                    // Randomize aspect ratios if not using intrinsic image height (which we are via object-cover + layout, but let's just let image dictate height if possible, or force some variety)
                    // Since fallback images have different crop params in URL (w=400&h=500 vs h=300), they will naturally vary.
                    // But API images might be uniform. To ensure "Pinterest" look, we can't easily force it without potentially cropping heads/feet.
                    // I'll trust the images or the fallback structure.
                    "w-full"
                }`}>
                    <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                
                {/* Hover Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-medium text-sm tracking-wide bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    View
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPreview;
