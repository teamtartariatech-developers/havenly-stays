import { motion } from "framer-motion";
import { Star, MapPin, Users, Wifi, Car, Heart } from "lucide-react";

const properties = [
  {
    id: 1,
    name: "Serene Forest Villa",
    location: "Mountain Haven",
    price: 349,
    rating: 4.9,
    reviews: 128,
    guests: 6,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    amenities: ["WiFi", "Parking"],
    type: "Villa",
  },
  {
    id: 2,
    name: "Lakeside Cottage",
    location: "Lake Serenity",
    price: 199,
    rating: 4.8,
    reviews: 89,
    guests: 4,
    image: "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=600&h=400&fit=crop",
    amenities: ["WiFi", "Parking"],
    type: "Cottage",
  },
  {
    id: 3,
    name: "Beachfront Bungalow",
    location: "Coastal Paradise",
    price: 279,
    rating: 4.9,
    reviews: 156,
    guests: 4,
    image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=600&h=400&fit=crop",
    amenities: ["WiFi", "Parking"],
    type: "Bungalow",
  },
  {
    id: 4,
    name: "Luxury Safari Camp",
    location: "Desert Oasis",
    price: 449,
    rating: 5.0,
    reviews: 67,
    guests: 2,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    amenities: ["WiFi"],
    type: "Camp",
  },
  {
    id: 5,
    name: "Treetop Hideaway",
    location: "Forest Retreat",
    price: 229,
    rating: 4.7,
    reviews: 94,
    guests: 2,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    amenities: ["WiFi"],
    type: "Treehouse",
  },
  {
    id: 6,
    name: "Mountain Peak Cabin",
    location: "Mountain Haven",
    price: 189,
    rating: 4.8,
    reviews: 112,
    guests: 4,
    image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600&h=400&fit=crop",
    amenities: ["WiFi", "Parking"],
    type: "Cottage",
  },
];

const PropertiesSection = () => {
  return (
    <section id="properties" className="py-16 md:py-24 bg-section-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Properties</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Featured Stays
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Handpicked accommodations for the perfect escape, each with its own unique charm.
          </p>
        </motion.div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500">
                {/* Image */}
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Type Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-foreground">{property.type}</span>
                  </div>

                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="w-5 h-5 text-foreground" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Location & Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium">{property.rating}</span>
                      <span className="text-xs text-muted-foreground">({property.reviews})</span>
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {property.name}
                  </h3>

                  {/* Amenities */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{property.guests} guests</span>
                    </div>
                    {property.amenities.includes("WiFi") && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Wifi className="w-4 h-4" />
                        <span className="text-sm">WiFi</span>
                      </div>
                    )}
                    {property.amenities.includes("Parking") && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Car className="w-4 h-4" />
                        <span className="text-sm">Parking</span>
                      </div>
                    )}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <span className="text-2xl font-bold text-foreground">${property.price}</span>
                      <span className="text-muted-foreground text-sm"> / night</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Book Now
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all"
          >
            View All Properties
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PropertiesSection;
