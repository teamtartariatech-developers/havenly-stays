import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Sunset Yoga Retreat",
    date: "Feb 15-17, 2026",
    location: "Coastal Paradise",
    attendees: 24,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    category: "Wellness",
  },
  {
    id: 2,
    title: "Mountain Photography Workshop",
    date: "Mar 5-8, 2026",
    location: "Mountain Haven",
    attendees: 16,
    image: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=600&h=400&fit=crop",
    category: "Adventure",
  },
  {
    id: 3,
    title: "Wine & Dine Weekend",
    date: "Apr 12-14, 2026",
    location: "Lake Serenity",
    attendees: 40,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    category: "Culinary",
  },
];

const EventsSection = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-hero-gradient opacity-5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-accent font-medium text-sm uppercase tracking-wider">Experiences</span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            Upcoming Events
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join us for exclusive experiences that create lasting memories.
          </p>
        </motion.div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Featured Event */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 group"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-elevated">
              <img
                src={events[0].image}
                alt={events[0].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                <span className="inline-block bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium mb-4 w-fit">
                  {events[0].category}
                </span>
                <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  {events[0].title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="w-5 h-5" />
                    <span>{events[0].date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-5 h-5" />
                    <span>{events[0].location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Users className="w-5 h-5" />
                    <span>{events[0].attendees} spots left</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-white text-forest-700 px-6 py-3 rounded-full font-medium w-fit hover:bg-white/90 transition-colors"
                >
                  Reserve Your Spot
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Side Events */}
          <div className="flex flex-col gap-6">
            {events.slice(1).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-[200px] md:h-[237px] rounded-3xl overflow-hidden shadow-card hover:shadow-elevated transition-all">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium mb-2 w-fit">
                      {event.category}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
