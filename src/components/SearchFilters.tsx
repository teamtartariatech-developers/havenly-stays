import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Users, MapPin } from "lucide-react";

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

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl shadow-card p-4 md:p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Location</p>
                <input
                  type="text"
                  placeholder="Where to?"
                  className="w-full bg-transparent text-foreground font-medium placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Check In */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Check In</p>
                <input
                  type="text"
                  placeholder="Add dates"
                  className="w-full bg-transparent text-foreground font-medium placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Guests</p>
                <input
                  type="text"
                  placeholder="Add guests"
                  className="w-full bg-transparent text-foreground font-medium placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Search Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-4 font-medium hover:bg-primary/90 transition-colors"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Property Type Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
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
    </section>
  );
};

export default SearchFilters;
