import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import irctcLogo from "@/assets/irctc-logo.png";
import { AccentBar } from "@/components/common/AccentBar";

const footerColumns = [
  { h: "Holidays", l: ["Domestic Packages", "International Packages", "Pilgrimage Circuits", "Honeymoon Specials", "Group Tours"] },
  { h: "Tourist Trains", l: ["Maharajas' Express", "Golden Chariot", "Palace on Wheels", "Deccan Odyssey", "Bharat Gaurav Trains"] },
  { h: "Book", l: ["Flights", "Hotels", "Buses", "Retiring Rooms", "Airport Transfers"] },
  { h: "Support", l: ["Manage Booking", "Cancellation Policy", "Refund Status", "Contact Us", "FAQs"] },
];

export function Footer() {
  return (
    <footer id="site-footer" className="mt-8 bg-navy text-white/85">
      <AccentBar />
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                <img src={irctcLogo} alt="IRCTC" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <div className="font-display text-lg font-bold">
                  IRCTC <span className="text-azure">Tourism</span>
                </div>
                <div className="text-[11px] text-white/60">भारतीय रेल · Ministry of Railways</div>
              </div>
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-white/65">
              Incredible journeys across Bharat and beyond. A Government of India enterprise trusted by millions of
              travellers for secure, all-inclusive holidays.
            </p>
            <div className="mt-5 space-y-2 text-[13px]">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-azure" /> 14646 · 0755-6610661
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-azure" /> care@irctctourism.com
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-azure" /> New Delhi, India
              </div>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.h}>
              <div className="mb-3 text-[13px] font-bold uppercase tracking-wide text-white">{col.h}</div>
              <ul className="space-y-2 text-[13px]">
                {col.l.map((item) => (
                  <li key={item}>
                    <a className="cursor-pointer text-white/65 transition hover:text-azure">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl bg-white/5 p-4 text-[12px] text-white/70">
          <span className="inline-flex items-center gap-1.5 font-semibold text-white">
            <ShieldCheck size={15} className="text-emerald-400" /> 100% Secure Payments
          </span>
          <span className="text-white/30">•</span>
          <span>Verified Government Portal</span>
          <span className="text-white/30">•</span>
          <span>No-Cost EMI available</span>
          <span className="text-white/30">•</span>
          <span>Part-payment (25% / 75%) on tours above ₹50,000</span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12px] text-white/55 md:flex-row">
          <span>© {new Date().getFullYear()} Indian Railway Catering &amp; Tourism Corporation Ltd. All rights reserved.</span>
          <div className="flex gap-4">
            <a className="cursor-pointer hover:text-white">Privacy</a>
            <a className="cursor-pointer hover:text-white">Terms</a>
            <a className="cursor-pointer hover:text-white">Accessibility</a>
            <a className="cursor-pointer hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
