import { useState, useRef } from "react";
import { motion } from "framer-motion";

const propertyTypes = [
  { id: "all", label: "All" },
  { id: "camps", label: "Camps" },
  { id: "cottages", label: "Cottages" },
  { id: "villas", label: "Villas" },
  { id: "bungalows", label: "Bungalows" },
  { id: "treehouses", label: "Treehouses" },
];

const SearchFilters = () => {
  const [activeType, setActiveType] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);

  // We are removing the JS-based sticky logic entirely to prevent blinking.
  // Instead, we will rely on CSS `position: sticky`. 
  // However, since we want the tags to stick *below* the nav header, and the search bar *not* to stick,
  // we will restructure the layout slightly.

  return (
    <section 
      ref={sectionRef}
      className="relative"
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Title and Description Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 md:mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Explore Properties
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover handpicked accommodations for the perfect escape, each with its own unique charm and character. 
            From cozy cottages to luxurious villas, find your ideal stay in nature's embrace.
          </p>
        </motion.div>
      </div>

      {/* Property Type Tags - STICKY to Header - Outside container for full width */}
      <div className="sticky top-16 md:top-20 z-40 w-full py-3 bg-section-gradient/98 backdrop-blur-md border-b border-border/20 shadow-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {propertyTypes.map((type) => (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveType(type.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-full font-medium text-sm transition-all ${
                  activeType === type.id
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {type.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SearchFilters;
