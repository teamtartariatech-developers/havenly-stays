import { MessageCircle, Phone } from "lucide-react";

const PHONE_NUMBER = "+919226869678";
const WHATSAPP_NUMBER = "919226869678";

const FloatingContactButtons = () => {
  const whatsappText =
    "Hi! I am interested in booking a stay at Havenly Stays. Please share availability and offers.";
  const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <a
        href={`tel:${PHONE_NUMBER}`}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Call Havenly Stays"
      >
        <Phone className="h-5 w-5 text-primary" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Call us
        </span>
      </a>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] shadow-lg ring-1 ring-black/5 transition-all hover:-translate-y-0.5 hover:shadow-xl"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5 text-white" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          WhatsApp
        </span>
      </a>
    </div>
  );
};

export default FloatingContactButtons;
