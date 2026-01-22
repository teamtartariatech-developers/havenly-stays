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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl translate-x-[50%] translate-y-[50%]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide uppercase mb-4">
            Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            We Provide The{" "}
            <span className="relative">
              <span className="relative z-10 text-primary">Best Service</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-0 rounded-sm"></span>
            </span>{" "}
            Ever
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Experience unparalleled hospitality and create memories that last a lifetime with our premium services and dedicated team.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-100/50 overflow-hidden"
            >
              {/* Hover Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col items-start text-left">
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300">
                  <service.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Call to Action or Trust Indicator could go here */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-2 text-slate-500 text-sm font-medium">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
              ))}
            </div>
            <span>Trusted by 10,000+ happy guests</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;