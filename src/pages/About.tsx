import { motion } from "framer-motion";
import { useEffect } from "react";
import { Leaf, Heart, Star, Users, Award, Globe, MapPin, Phone, TreePine } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { updatePageMeta } from "@/utils/seo";

const values = [
  {
    icon: Heart,
    title: "Passion for Nature",
    description: "We are dedicated to providing authentic outdoor experiences while preserving the natural beauty of our surroundings.",
  },
  {
    icon: Award,
    title: "Safety First",
    description: "Your safety is our priority. All our activities and accommodations meet the highest safety standards.",
  },
  {
    icon: Users,
    title: "Community Focus",
    description: "We create spaces for meaningful connections between travelers and support our local community.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Our commitment to sustainability guides every decision we make, from waste management to energy use.",
  },
];

const stats = [
  { value: "5+", label: "Years Experience" },
  { value: "50+", label: "Properties" },
  { value: "500+", label: "Happy Guests" },
  { value: "4.9", label: "Rating" },
];

// Removed team section as per website reference

const About = () => {
  useEffect(() => {
    const canonical = `${window.location.origin}/about`;
    updatePageMeta({
      title: "About Pavana Agro Tourism | Curated Lakeside Retreats",
      description:
        "Learn about Pavana Agro Tourism, our passion for nature, and our commitment to safe, sustainable stays around Pawna Lake.",
      canonical,
      ogImage:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&h=630&fit=crop",
    });
  }, []);

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
              Crafting Memories
              <span className="block text-white/80">Since 2019</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Welcome to Pavana Agro Tourism, the registered business behind our curated lakeside stays. 
              What started as a passion for nature has evolved into a curated collection of stays that blend 
              modern elegance with the raw beauty of the Pawna Lake region.
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
                Providing Thoughtfully Designed Accommodations
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Our mission is to provide thoughtfully designed accommodations that complement the natural beauty 
                of our surroundings. We are committed to sustainable tourism, supporting our local community, 
                and delivering exceptional value through our all-inclusive packages.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We believe that every stay should be an experience. Our dedicated team works tirelessly to 
                ensure that from the moment you arrive until your departure, every detail is handled with 
                precision and care.
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

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-section-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Pavana Agro Tourism?
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Prime Lakeside Location</h4>
                <p className="text-muted-foreground leading-relaxed">Enjoy the breathtaking beauty and tranquility of Pawna Lake right at your doorstep.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Heart size={24} />
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Luxury Accommodations</h4>
                <p className="text-muted-foreground leading-relaxed">Our villas and cottages offer a sophisticated and intimate atmosphere, perfect for relaxation.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">All-Inclusive Experience</h4>
                <p className="text-muted-foreground leading-relaxed">We provide everything you need for a stress-free stay, including premium meals and activities.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <TreePine size={24} />
              </div>
              <div>
                <h4 className="font-display text-xl font-semibold text-foreground mb-2">Curated Activities</h4>
                <p className="text-muted-foreground leading-relaxed">From water sports to mountain treks, we offer activities tailored for every kind of guest.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for a weekend escape, a romantic retreat, or a family vacation, 
              Pavana Agro Tourism is your perfect destination.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-white text-primary hover:bg-white/90 px-8 py-4"
                onClick={() => window.location.href = '/#properties'}
              >
                Book Your Stay
              </Button>
              <a
                href="tel:+918668322633"
                className="inline-flex items-center justify-center px-8 py-4 text-white border border-white rounded-md hover:bg-white/10 transition-colors"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Us Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
