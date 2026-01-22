import React, { useState, useEffect, useRef } from "react";
import { api, City } from "@/services/api";

// Use a local interface that matches the reference structure but maps from our City data
interface Location {
  id: string; // The reference uses string ids, but our API uses numbers. We'll convert.
  name: string;
  image: string;
}

interface LocationCardsProps {
  // These props were in the reference, but the current usage in Index.tsx might not pass them.
  // We'll make them optional and handle internal state if not provided.
  selectedLocation?: string;
  onLocationSelect?: (locationId: string) => void;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=400&h=500&fit=crop",
];

export default function LocationCards({
  selectedLocation: propSelectedLocation,
  onLocationSelect: propOnLocationSelect,
}: LocationCardsProps) {
  // Handle internal state if props are not provided (since Index.tsx usage might change later)
  const [internalSelectedLocation, setInternalSelectedLocation] = useState<string>("");

  const selectedLocation = propSelectedLocation !== undefined ? propSelectedLocation : internalSelectedLocation;
  const onLocationSelect = (id: string) => {
    if (propOnLocationSelect) {
      propOnLocationSelect(id);
    } else {
      setInternalSelectedLocation(id);
    }
  };

  const [current, setCurrent] = useState(0);
  const [fetchedLocations, setFetchedLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const cities = await api.getCities();

        // Map City to Location interface
        const allLocations: Location[] = cities.map((city, index) => ({
          id: city.id.toString(),
          name: city.name,
          // Use city image if available, else fallback to cyclic default images
          image: city.image || defaultImages[index % defaultImages.length],
        }));

        // --- Start of new sorting logic (from reference) ---
        // Find the specific locations
        let pawna: Location | undefined;
        let lonavala: Location | undefined;
        let karjat: Location | undefined;
        const otherLocations: Location[] = [];

        allLocations.forEach((location) => {
          const name = location.name.toLowerCase();
          if (name.includes("pawna")) {
            pawna = location;
          } else if (name.includes("lonavala")) {
            lonavala = location;
          } else if (name.includes("karjat")) {
            karjat = location;
          } else {
            otherLocations.push(location);
          }
        });

        const sortedLocations: Location[] = [];

        // 1. Add Pawna first. This makes it index 0, the default card.
        if (pawna) sortedLocations.push(pawna);

        // 2. Add Karjat second. This makes it index 1, to the "right" of Pawna.
        if (karjat) sortedLocations.push(karjat);

        // 3. Add all other locations.
        sortedLocations.push(...otherLocations);

        // 4. Add Lonavala last. This makes it wrap around to the "left" of Pawna.
        if (lonavala) sortedLocations.push(lonavala);

        // Fallback in case one of the key locations wasn't found
        if (!pawna || !lonavala || !karjat) {
          // If we don't have the specific ones, just use the API order or sort alphabetically?
          // The reference used a fallback sort. We'll just use what we have if specific ones are missing.
          if (sortedLocations.length === 0) {
            // If completely empty after logic (unlikely unless allLocations is empty), use allLocations
            setFetchedLocations(allLocations);
          } else {
            setFetchedLocations(sortedLocations);
          }
        } else {
          setFetchedLocations(sortedLocations);
        }

        // helper to set default selection if none
        if (sortedLocations.length > 0 && !selectedLocation) {
          // If we have a preferred "Pawna" (index 0), select it initially?
          // Or just leave it blank. The reference `selectedLocation` comes from props usually.
          // If internally managed, we might want to default select the first one.
          if (!propSelectedLocation) {
            // onLocationSelect(sortedLocations[0].id); // Optional: select first by default
          }
        }

      } catch (error) {
        console.error("Error loading locations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, []); // Run once on mount

  const next = () => setCurrent((prev) => (prev + 1) % fetchedLocations.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + fetchedLocations.length) % fetchedLocations.length
    );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const diff = touchStartX.current - touchEndX.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getCarouselItems = () => {
    if (!fetchedLocations.length) return [];
    const items = [];
    const len = fetchedLocations.length;
    // If we have fewer items than needed for the carousel logic (5 items: -2 to +2), handle gracefully
    // But assuming we have enough locations or the modulo logic handles it.
    // If len < 5, there might be duplicates in view, but that's acceptable for this visual effect.

    for (let i = -2; i <= 2; i++) {
      // Javascript modulo for negative numbers behavior correction
      let idx = (current + i) % len;
      if (idx < 0) idx += len;

      items.push({ ...fetchedLocations[idx], level: i });
    }
    return items;
  };

  // Update the getLevelStyle function for smoother mobile animations:
  const getLevelStyle = (level: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      left: "50%",
      top: "50%",
      transition: "all 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smoother easing
      cursor: "pointer",
      zIndex: 10 - Math.abs(level),
      opacity: Math.abs(level) > 2 ? 0 : 1,
      boxShadow: "0 10px 24px 0 rgba(0,0,0,0.15)",
      borderRadius: "12px",
      overflow: "hidden",
      willChange: "transform, opacity",
      transform: "translate3d(-50%, -50%, 0)", // Base transform for hardware acceleration
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      perspective: "1000px",
      WebkitPerspective: "1000px",
    };

    // Adjusted sizes and transforms for mobile
    switch (level) {
      case 0:
        return {
          ...base,
          width: "140px", // Slightly larger center card
          height: "200px",
          zIndex: 20,
          opacity: 1,
          transform: "translate3d(-50%, -50%, 0) scale(1)",
        };
      case -1:
        return {
          ...base,
          width: "120px",
          height: "180px",
          opacity: 0.8,
          zIndex: 15,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.9) translateX(-110%) rotateY(15deg)",
        };
      case 1:
        return {
          ...base,
          width: "120px",
          height: "180px",
          opacity: 0.8,
          zIndex: 15,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.9) translateX(110%) rotateY(-15deg)",
        };
      case -2:
        return {
          ...base,
          width: "100px",
          height: "160px",
          opacity: 0.6,
          zIndex: 12,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.8) translateX(-220%) rotateY(25deg)",
        };
      case 2:
        return {
          ...base,
          width: "100px",
          height: "160px",
          opacity: 0.6,
          zIndex: 12,
          transform:
            "translate3d(-50%, -50%, 0) scale(0.8) translateX(220%) rotateY(-25deg)",
        };
      default:
        return { ...base, opacity: 0 };
    }
  };

  if (loading) {
    return (
      <section className="relative will-change-transform backface-visibility-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Explore Locations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our beautiful resorts across stunning destinations
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading locations...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative will-change-transform backface-visibility-hidden py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Popular Destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover luxury accommodations across India's most beautiful destinations
          </p>
        </div>

        {/* Desktop view - horizontal scroll without scrollbar */}
        <div className="hidden lg:block relative overflow-x-hidden">
          <div className="overflow-x-auto -mx-4 px-4">
            <div
              className="flex gap-6 pb-6 snap-x snap-mandatory scroll-smooth min-w-max"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                transform: "translate3d(0,0,0)",
              }}
            >
              {fetchedLocations.map((location, index) => (
                <div key={location.id} className="snap-center">
                  <LocationCard
                    location={location}
                    isSelected={selectedLocation === location.id}
                    onClick={() => onLocationSelect(location.id)}
                    animationDelay={index * 100}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile view - 3D stacked with 5 cards and gaps */}
        <div
          className="lg:hidden relative mx-auto hardware-accelerated"
          style={{
            height: "260px", // Increased height for better visibility
            maxWidth: "100%",
            perspective: "1200px",
            overflow: "hidden",
            transform: "translate3d(0,0,0)",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="relative w-full h-full transform-gpu"
            style={{
              minHeight: 220,
              transform: "translate3d(0,0,0)",
            }}
          >
            {getCarouselItems().map((location) => (
              <div
                key={`${location.id}-${location.level}`} // Unique key needed for map
                style={getLevelStyle(location.level)}
                onClick={() => {
                  if (Math.abs(location.level) <= 1) {
                    onLocationSelect(location.id);
                  } else if (location.level === -2) {
                    prev();
                  } else if (location.level === 2) {
                    next();
                  }
                }}
                className={`
          group transition-all duration-500 hardware-accelerated
          ${selectedLocation === location.id && location.level === 0
                    ? "ring-2 ring-emerald-400"
                    : ""}
        `}
              >
                <img
                  src={location.image}
                  alt={`${location.name} luxury accommodations and resorts`}
                  className="w-full h-full object-cover"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{
                    transform: "translate3d(0,0,0)",
                    backfaceVisibility: "hidden",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col justify-end items-center gap-2">
                  <h3
                    className={`
              font-bold text-white text-center transform-gpu
              ${location.level === 0 ? "text-base" : "text-sm"}
            `}
                    style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
                  >
                    {location.name}
                  </h3>
                  {/* Mobile Button - only show for center card (level 0) */}
                  {location.level === 0 && (
                    <div
                      className={`
                        inline-block px-4 py-2 rounded-full font-medium transition-all duration-300 transform-gpu
                        ${selectedLocation === location.id
                          ? "bg-emerald-400 text-emerald-900 shadow-lg"
                          : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                        }
                      `}
                      style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        textShadow: selectedLocation === location.id ? 'none' : '0 1px 2px rgba(0,0,0,0.3)',
                        boxShadow: selectedLocation === location.id ? '0 4px 8px rgba(0,0,0,0.2)' : 'none'
                      }}
                    >
                      {selectedLocation === location.id ? "Selected" : "Explore"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Desktop helper component
function LocationCard({
  location,
  isSelected,
  onClick,
  animationDelay,
}: {
  location: Location;
  isSelected: boolean;
  onClick: () => void;
  animationDelay: number;
}) {
  return (
    <div
      onClick={onClick}
      className={`
        flex-shrink-0 w-80 cursor-pointer transform transition-transform duration-300
        will-change-transform hardware-accelerated
        ${isSelected ? "scale-[1.02]" : ""}
      `}
      style={{
        animationDelay: `${animationDelay}ms`,
        transform: "translate3d(0,0,0)",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
    >
      <div
        className={`
        relative rounded-3xl overflow-hidden shadow-lg transition-shadow duration-300
        ${isSelected ? "shadow-2xl ring-2 ring-emerald-400" : "hover:shadow-xl"}
      `}
      >
        <img
          src={location.image}
          alt={`${location.name} luxury accommodations and resorts`}
          className="w-full h-56 object-cover"
          loading="lazy"
          decoding="async"
          style={{
            transform: "translate3d(0,0,0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-2xl font-bold text-white mb-3 transform-gpu">
            {location.name}
          </h3>
          <div
            className={`
            inline-block px-6 py-3 rounded-full font-medium transition-colors duration-300
            ${isSelected
                ? "bg-emerald-400 text-emerald-900"
                : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
              }
          `}
          >
            {isSelected ? "Selected" : "Explore"}
          </div>
        </div>
      </div>
    </div>
  );
}
