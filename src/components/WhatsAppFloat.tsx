/**
 * WhatsAppFloat — fixed bottom-right click-to-chat button.
 * Visible on all sections; opens WhatsApp with a prefilled message.
 */

import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/919832465858?text=Hi%20Priyabrata%2C%20I%20came%20across%20your%20portfolio%20and%20would%20love%20to%20connect.";

const WhatsAppFloat = () => {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Pulsing ring */}
      <span className="absolute inset-0 rounded-full bg-string/40 animate-ping" />
      {/* Button */}
      <span
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-string text-background shadow-lg shadow-string/30 hover:scale-110 transition-transform"
      >
        <MessageCircle className="w-6 h-6" />
      </span>
      {/* Tooltip */}
      <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-xs px-3 py-1.5 rounded-md bg-card border border-border text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        // chat on WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppFloat;
