import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Music, PartyPopper, Sparkles } from "lucide-react";

const pastEvents = [
  {
    id: 1,
    title: "New Year's Eve Bash",
    date: "Dec 31, 2025",
    location: "Riverside Resort",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&h=600&fit=crop",
    category: "Celebration",
  },
  {
    id: 2,
    title: "Sunset Musical Night",
    date: "Jan 15, 2026",
    location: "Mountain View Deck",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop",
    category: "Music",
  },
  {
    id: 3,
    title: "Neon Pool Party",
    date: "Jan 20, 2026",
    location: "Infinity Pool",
    image: "https://images.unsplash.com/photo-1576442672323-c90a2a5009a0?w=800&h=600&fit=crop",
    category: "Party",
  },
   {
    id: 4,
    title: "Corporate Gala",
    date: "Jan 28, 2026",
    location: "Grand Ballroom",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    category: "Gala",
  },
  {
    id: 5,
    title: "EDM Night",
    date: "Feb 5, 2026",
    location: "Open Air Arena",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
    category: "Music",
  },
    {
    id: 6,
    title: "Valentine's Glow",
    date: "Feb 14, 2026",
    location: "Lakeside Deck",
    image: "https://images.unsplash.com/photo-1519225468359-2996bc140aaa?w=800&h=600&fit=crop",
    category: "Dining",
  },
];

const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState<typeof pastEvents[0] | null>(null);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-[#050505]">
      {/* Dynamic CSS for Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Subtle Neon Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 text-cyan-400 font-medium text-sm uppercase tracking-wider bg-cyan-950/30 px-4 py-1.5 rounded-full border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Vibes & Memories
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold mt-6 mb-4 text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
            Recent Happenings
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Relive the electric atmosphere and unforgettable moments from our recent events.
          </p>
        </motion.div>
      </div>

      {/* Infinite Marquee */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Gradient Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

        <div className="flex w-max animate-marquee gap-6 md:gap-8 px-4">
          {[...pastEvents, ...pastEvents].map((event, index) => (
            <div
              key={`${event.id}-${index}`}
              className="relative w-[300px] md:w-[400px] h-[400px] md:h-[500px] flex-shrink-0 group rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-purple-500/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              onClick={() => setSelectedEvent(event)}
            >
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
              />
              
              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent opacity-90 transition-opacity duration-300" />
              
              {/* Neon Line Decoration */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute inset-0 p-6 flex flex-col justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  {event.category}
                </span>
                <h3 className="font-display text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-purple-200 group-hover:to-cyan-200 transition-all">
                  {event.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#050505]/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white z-50 border border-white/10"
              onClick={() => setSelectedEvent(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="md:w-2/3 h-[40vh] md:h-auto relative overflow-hidden group">
                 <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60 md:opacity-0" />
              </div>
              <div className="md:w-1/3 p-6 md:p-10 flex flex-col justify-center bg-[#0a0a0a] relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[60px] pointer-events-none" />
                
                <span className="relative z-10 text-cyan-400 font-bold text-sm tracking-widest uppercase mb-3 flex items-center gap-2">
                  <PartyPopper className="w-4 h-4" />
                  {selectedEvent.category}
                </span>
                <h3 className="relative z-10 font-display text-2xl md:text-4xl font-bold text-white mb-6">
                  {selectedEvent.title}
                </h3>
                <div className="relative z-10 space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-purple-500" />
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-cyan-500" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <p className="relative z-10 text-gray-400 leading-relaxed">
                  Experience the magic of our {selectedEvent.category.toLowerCase()} event. From the vibrant atmosphere to the curated details at {selectedEvent.location}, every moment was crafted for pure joy and celebration.
                </p>
                
                <div className="relative z-10 mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                        <Music className="w-5 h-5" />
                    </div>
                    <div className="text-sm">
                        <p className="text-white font-medium">Live Entertainment</p>
                        <p className="text-gray-500">Featured at this event</p>
                    </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsSection;
