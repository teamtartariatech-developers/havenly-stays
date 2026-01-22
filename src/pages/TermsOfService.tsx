import { motion } from "framer-motion";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { updatePageMeta } from "@/utils/seo";

const TermsOfService = () => {
  useEffect(() => {
    const canonical = `${window.location.origin}/terms-of-service`;
    updatePageMeta({
      title: "Terms of Service | Pavana Agro Tourism",
      description:
        "Read our terms of service for booking accommodations, payment policies, cancellation terms, and conditions for staying at our resort properties.",
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
              Terms of Service
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Please read these terms carefully before booking your stay with us.
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

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                By accessing and using Pavana Agro Tourism's website and booking services, you accept and agree to be bound by the terms and provision of this agreement.
                These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">2. Booking and Reservation</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">2.1 Reservation Process</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                All bookings are subject to availability and confirmation. When you make a booking through our website, you will receive a booking confirmation via email.
                This confirmation constitutes our acceptance of your booking and forms a legally binding contract between you and Pavana Agro Tourism.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">2.2 Guest Information</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to provide accurate, current, and complete information about yourself and any other guests during the booking process.
                You are responsible for ensuring that all guest information provided is correct and up-to-date.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">2.3 Age Restrictions</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Guests must be at least 18 years old to make a booking. All guests under 18 must be accompanied by a parent or legal guardian.
                Some properties may have additional age restrictions for certain activities or facilities.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">3. Payment Terms</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">3.1 Payment Methods</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We accept various payment methods including credit/debit cards, net banking, UPI, and digital wallets.
                All payments must be made in Indian Rupees (INR) unless otherwise specified.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">3.2 Advance Payment</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An advance payment is required at the time of booking to secure your reservation. The advance amount varies by property and season but is typically 50% of the total booking value.
                The remaining balance must be paid upon arrival at the property.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">3.3 Payment Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We use industry-standard SSL encryption to protect your payment information. Your card details are processed securely and are not stored on our servers.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">4. Cancellation and Refund Policy</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">4.1 Cancellation by Guest</h3>
              <div className="bg-card p-6 rounded-lg border mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-semibold">Cancellation Period</th>
                      <th className="text-left py-2 font-semibold">Refund Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">More than 7 days before check-in</td>
                      <td className="py-3">100% refund (excluding processing fees)</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">3-7 days before check-in</td>
                      <td className="py-3">50% refund</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Less than 3 days before check-in</td>
                      <td className="py-3">No refund</td>
                    </tr>
                    <tr>
                      <td className="py-3">No-show</td>
                      <td className="py-3">No refund</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">4.2 Cancellation by Pavana Agro Tourism</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In rare circumstances, we may need to cancel your booking due to unforeseen circumstances such as natural disasters, maintenance issues, or government restrictions.
                In such cases, we will provide full refund or alternative accommodation options.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">4.3 Refund Processing</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Approved refunds will be processed within 7-10 business days and credited back to the original payment method.
                Processing times may vary depending on your bank or payment provider.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">5. Check-in and Check-out</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">5.1 Check-in Time</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Standard check-in time is 2:00 PM. Early check-in may be available subject to availability and additional charges may apply.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">5.2 Check-out Time</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Standard check-out time is 11:00 AM. Late check-out may be available subject to availability and additional charges may apply.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">5.3 Identification Requirements</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Valid government-issued photo identification is required for all guests at check-in. This may include passport, driving license, or Aadhaar card.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">6. Guest Responsibilities</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">6.1 Property Care</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Guests are responsible for maintaining the property in good condition. Any damage caused during your stay may result in additional charges.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">6.2 House Rules</h3>
              <ul className="text-muted-foreground leading-relaxed mb-6 ml-6">
                <li className="mb-2">Respect quiet hours (typically 10:00 PM to 8:00 AM)</li>
                <li className="mb-2">No smoking inside the property (designated smoking areas available)</li>
                <li className="mb-2">Proper disposal of waste and recycling</li>
                <li className="mb-2">Respect for other guests and property staff</li>
                <li className="mb-2">Adherence to local laws and regulations</li>
                <li className="mb-2">Maximum occupancy limits must be observed</li>
              </ul>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">6.3 Pets</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pets are not allowed unless explicitly stated in the property description and approved by management. Additional charges may apply for pet-friendly accommodations.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">7. Liability and Insurance</h2>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">7.1 Our Liability</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Pavana Agro Tourism's liability is limited to the amount paid for the booking. We are not liable for indirect or consequential losses.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">7.2 Guest Liability</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Guests are liable for any damage caused to the property during their stay. This includes damage caused by accompanying guests or visitors.
              </p>

              <h3 className="font-display text-xl font-semibold text-foreground mt-6 mb-3">7.3 Travel Insurance</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We strongly recommend purchasing travel insurance to cover cancellation, medical emergencies, and other unforeseen circumstances.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">8. Force Majeure</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Pavana Agro Tourism shall not be liable for any failure to perform its obligations under these terms if such failure results from circumstances beyond its reasonable control,
                including but not limited to natural disasters, pandemics, government restrictions, strikes, or other unforeseen events.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">9. Amendments</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website.
                Your continued use of our services after changes are posted constitutes acceptance of the modified terms.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Maharashtra.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-8 mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
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

export default TermsOfService;