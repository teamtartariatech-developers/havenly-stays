import { motion } from "framer-motion";
import { Leaf, Heart, Star, Users, Award, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const values = [
  {
    icon: Leaf,
    title: "Sustainability",
    description: "We're committed to eco-friendly practices that protect the natural beauty we share with our guests.",
  },
  {
    icon: Heart,
    title: "Genuine Care",
    description: "Every guest is family. We go beyond expectations to create meaningful, memorable experiences.",
  },
  {
    icon: Star,
    title: "Excellence",
    description: "From our accommodations to our service, we pursue perfection in every detail.",
  },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "50+", label: "Unique Properties" },
  { value: "12,000+", label: "Happy Guests" },
  { value: "4.9", label: "Average Rating" },
];

const team = [
  {
    name: "Alexandra Rivers",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Marcus Chen",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Sarah Mitchell",
    role: "Guest Experience Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/5 blur-3xl"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-white/70 font-medium text-sm uppercase tracking-wider">Our Story</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Creating Escapes
              <span className="block text-white/80">Since 2010</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Born from a passion for nature and hospitality, Evergreen Resorts has grown 
              from a single mountain retreat to a collection of extraordinary properties 
              across the world's most breathtaking destinations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=700&fit=crop"
                  alt="Resort Experience"
                  className="rounded-3xl shadow-elevated w-full h-[400px] md:h-[500px] object-cover"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="absolute -bottom-6 -right-6 bg-card rounded-2xl p-6 shadow-card hidden md:block"
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-10 h-10 text-primary" />
                    <div>
                      <p className="font-display text-2xl font-bold text-foreground">Best Resort</p>
                      <p className="text-muted-foreground text-sm">Travel Awards 2025</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Mission</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Connecting People with Nature's Wonders
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                We believe that the most profound moments happen when we disconnect from 
                the everyday and reconnect with the natural world. Our mission is to provide 
                sanctuaries where guests can find peace, adventure, and renewal.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Each of our properties is thoughtfully designed to harmonize with its 
                surroundings, offering authentic experiences that respect and celebrate 
                the local environment and culture.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-card hover:shadow-elevated transition-all text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <p className="text-white/70">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-accent font-medium text-sm uppercase tracking-wider">Our Team</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
              Meet the Visionaries
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Passionate individuals dedicated to crafting unforgettable experiences.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative mb-6 inline-block">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full object-cover mx-auto shadow-card"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Globe className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Global Network of Escapes
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              From mountain peaks to ocean shores, our properties span five continents, 
              each offering a unique window into the world's most inspiring landscapes.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">15+ Countries</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-soft">
                <Star className="w-5 h-5 text-primary" />
                <span className="text-foreground font-medium">50+ Properties</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
