import { useRef } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    text: "Absolutely magical experience! The villa was stunning and the staff went above and beyond. Can't wait to return.",
    property: "Serene Forest Villa",
    date: "January 2026",
  },
  {
    id: 2,
    name: "James Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    text: "Perfect getaway for our anniversary. The views were breathtaking and the amenities exceeded our expectations.",
    property: "Lakeside Cottage",
    date: "December 2025",
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    text: "The best resort experience I've ever had. Peaceful, luxurious, and the nature walks were incredible.",
    property: "Mountain Peak Cabin",
    date: "January 2026",
  },
  {
    id: 4,
    name: "Michael Thompson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    text: "From booking to checkout, everything was seamless. The private beach access was the highlight of our trip.",
    property: "Beachfront Bungalow",
    date: "November 2025",
  },
  {
    id: 5,
    name: "Lisa Park",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    text: "A hidden gem! The treehouse stay was an unforgettable adventure. My kids are still talking about it.",
    property: "Treetop Hideaway",
    date: "December 2025",
  },
];

const ReviewsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Guest Stories
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real experiences from our valued guests around the world.
          </p>
        </motion.div>
      </div>

      {/* Reviews Carousel */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 px-4 md:px-8 snap-x snap-mandatory scrollbar-hide"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-[320px] md:w-[400px] snap-center"
            >
              <div className="bg-card rounded-3xl p-6 md:p-8 shadow-card hover:shadow-elevated transition-all h-full border border-border/50">
                {/* Quote Icon */}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-foreground text-lg leading-relaxed mb-6 font-light">
                  "{review.text}"
                </p>

                {/* Property */}
                <p className="text-sm text-muted-foreground mb-6">{review.property}</p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
