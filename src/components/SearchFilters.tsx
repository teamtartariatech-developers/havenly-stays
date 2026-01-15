import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);

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
            </p>
        </motion.div>

        {/* Search Bar - Above Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-0"
        >
          <div className="max-w-2xl mx-auto">
            {/* Mobile Search Bar */}
            <div className="md:hidden relative">
              <div className="flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-border/50 px-4 py-2.5">
                <Search className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Location, type, price..."
                  className="flex-1 text-gray-800 text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  <Filter className="w-5 h-5 text-primary" />
                </button>
              </div>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex relative">
              <div className="flex items-center gap-4 bg-white rounded-3xl shadow-sm border border-border/50 px-6 py-3 w-full">
                <Search className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Location, type, price..."
                  className="flex-1 text-gray-800 text-base bg-transparent border-none outline-none placeholder:text-gray-400"
                />
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 hover:bg-secondary/80 transition-colors"
                >
                  <Filter className="w-6 h-6 text-primary" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Property Type Tags - STICKY to Header - Outside container for full width */}
      <div className="sticky top-16 md:top-20 z-40 w-full pt-0 pb-3 bg-section-gradient/98 backdrop-blur-md border-b border-border/20 shadow-sm">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3 md:justify-center overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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

      {/* Filter Sheet */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetContent side="bottom" className="h-[80vh] md:h-[70vh]">
          <SheetHeader>
            <SheetTitle>Filter Properties</SheetTitle>
            <SheetDescription>
              Select your preferences to find the perfect accommodation
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {/* Location Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter location..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Property Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveType(type.id);
                      setIsFilterOpen(false);
                    }}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeType === type.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Price Range
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  placeholder="Min"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="text-muted-foreground">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setActiveType("all");
                  setIsFilterOpen(false);
                }}
                className="px-6 py-3 rounded-lg border border-border bg-background font-medium hover:bg-secondary transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default SearchFilters;
