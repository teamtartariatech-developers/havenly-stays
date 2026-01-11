import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const galleryImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
    alt: "Resort Pool",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=500&fit=crop",
    alt: "Luxury Suite",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
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
    src: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400&h=400&fit=crop",
    alt: "Garden",
  },
];

const GalleryPreview = () => {
  return (
    <section className="py-16 md:py-24 bg-section-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Gallery</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2">
              Visual Journey
            </h2>
          </div>
          <Link to="/gallery">
            <motion.button
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-accent transition-colors"
            >
              View Full Gallery
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl cursor-pointer ${
                index === 1 ? "row-span-2" : ""
              } ${index === 3 || index === 5 ? "aspect-square" : "aspect-[4/3]"}`}
            >
              <Link to="/gallery">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-foreground" />
                  </div>
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
