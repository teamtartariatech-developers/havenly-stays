import { motion } from "framer-motion";
import { Shield, Users, Star, Clock, Award, Heart } from "lucide-react";

const ServiceSection = () => {
  const services = [
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Experience luxury accommodations with world-class amenities and impeccable service standards."
    },
    {
      icon: Users,
      title: "Personalized Experience",
      description: "Tailored experiences designed to create unforgettable memories for you and your loved ones."
    },
    {
      icon: Star,
      title: "5-Star Hospitality",
      description: "Exceptional hospitality with attention to every detail, ensuring your comfort and satisfaction."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock assistance and concierge services to make your stay seamless and enjoyable."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in hospitality, consistently delivering outstanding guest experiences."
    },
    {
      icon: Heart,
      title: "Family Friendly",
      description: "Perfect for families with child-friendly amenities, activities, and warm welcoming atmosphere."
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            We're Providing{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              Best Service Ever
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience unparalleled hospitality and create memories that last a lifetime with our premium services and dedicated team.
          </p>
        </motion.div>

        {/* Unified Service Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Top decorative bar */}
          <div className="h-2 bg-gradient-to-r from-green-500 via-blue-400 to-green-500"></div>

          <div className="p-8 md:p-12">
            {/* Service Grid - Responsive */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon with connecting line */}
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                      <service.icon className="w-10 h-10 text-white" />
                    </div>
                    {/* Connecting line (hidden on mobile, shown on larger screens) */}
                    {index < services.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-full w-20 h-0.5 bg-gradient-to-r from-green-300 to-blue-300 -translate-y-1/2">
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base max-w-xs">
                    {service.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Bottom decorative bar */}
            <div className="mt-12 h-2 bg-gradient-to-r from-blue-400 via-green-500 to-blue-400"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServiceSection;