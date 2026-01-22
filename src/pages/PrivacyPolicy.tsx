import { motion } from "framer-motion";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { updatePageMeta } from "@/utils/seo";

const PrivacyPolicy = () => {
  useEffect(() => {
    const canonical = `${window.location.origin}/privacy-policy`;
    updatePageMeta({
      title: "Privacy Policy | Pavana Agro Tourism",
      description:
        "Learn about how Pavana Agro Tourism collects, uses, and protects your personal information when booking stays and using our services.",
      canonical,
      ogImage:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=630&fit=crop",
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
            className="max-w-3xl text-center mx-auto"
          >
            <span className="text-white/70 font-medium text-sm uppercase tracking-wider">Legal</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
              Privacy Policy
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg max-w-none text-foreground"
            >
              <p className="text-muted-foreground mb-8">
                <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pavana Agro Tourism ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
                This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">2. Information We Collect</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">Personal Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may collect, use, store and transfer different kinds of personal data about you including:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2"><strong>Identity Data:</strong> First name, last name, username, date of birth, gender</li>
                <li className="mb-2"><strong>Contact Data:</strong> Email address, telephone numbers, billing address, delivery address</li>
                <li className="mb-2"><strong>Financial Data:</strong> Bank account and payment card details</li>
                <li className="mb-2"><strong>Transaction Data:</strong> Details about payments to and from you and other details of products and services you have purchased from us</li>
                <li className="mb-2"><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform</li>
                <li className="mb-2"><strong>Profile Data:</strong> Username and password, purchases or orders made by you, your interests, preferences, feedback and survey responses</li>
                <li className="mb-2"><strong>Usage Data:</strong> Information about how you use our website, products and services</li>
                <li className="mb-2"><strong>Marketing and Communications Data:</strong> Your preferences in receiving marketing from us and our third parties and your communication preferences</li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">Booking Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you make a booking with us, we collect:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2">Check-in and check-out dates</li>
                <li className="mb-2">Number of guests and room requirements</li>
                <li className="mb-2">Special requests or accessibility requirements</li>
                <li className="mb-2">Payment information and billing details</li>
                <li className="mb-2">Communication preferences</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2">To register you as a new customer</li>
                <li className="mb-2">To process and deliver your booking including managing payments, fees and charges</li>
                <li className="mb-2">To manage our relationship with you including notifying you about changes to our terms or privacy policy</li>
                <li className="mb-2">To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance, support, reporting and hosting of data)</li>
                <li className="mb-2">To deliver relevant website content and advertisements to you and measure or understand the effectiveness of the advertising we serve to you</li>
                <li className="mb-2">To use data analytics to improve our website, products/services, marketing, customer relationships and experiences</li>
                <li className="mb-2">To make suggestions and recommendations to you about goods or services that may be of interest to you</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may have to share your personal data with the parties set out below for the purposes set out in this privacy policy:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2"><strong>Service Providers:</strong> Third-party service providers who provide IT and system administration services, payment processing, and other services</li>
                <li className="mb-2"><strong>Professional Advisers:</strong> Including lawyers, bankers, auditors and insurers</li>
                <li className="mb-2"><strong>Tax Authorities:</strong> HM Revenue & Customs, regulators and other authorities</li>
                <li className="mb-2"><strong>Third Parties:</strong> To whom we may choose to sell, transfer, or merge parts of our business or our assets</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
                In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
                To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorised use or disclosure, and the purposes for which we process your personal data.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">7. Your Legal Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2"><strong>Request access</strong> to your personal data</li>
                <li className="mb-2"><strong>Request correction</strong> of your personal data</li>
                <li className="mb-2"><strong>Request erasure</strong> of your personal data</li>
                <li className="mb-2"><strong>Object to processing</strong> of your personal data</li>
                <li className="mb-2"><strong>Request restriction of processing</strong> your personal data</li>
                <li className="mb-2"><strong>Request transfer</strong> of your personal data</li>
                <li className="mb-2"><strong>Right to withdraw consent</strong></li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">8. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A cookie is a small file of letters and numbers that we store on your browser or the hard drive of your computer. Cookies contain information that is transferred to your computer's hard drive.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">9. Third-party Links</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you.
                We do not control these third-party websites and are not responsible for their privacy statements.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <div className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground mb-2"><strong>Pavana Agro Tourism</strong></p>
                <p className="text-muted-foreground mb-2">At- Pawna Lake</p>
                <p className="text-muted-foreground mb-2">Email: bookings@pavanatourism.com</p>
                <p className="text-muted-foreground">Phone: +91 8668322633</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;