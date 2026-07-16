import { useState } from "react";
import { ChevronDown, ExternalLink, Globe, Menu, MessageSquareText, Phone, Search, X } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { useScrolled } from "@/hooks/useScrolled";
import { Logo } from "@/components/common/Logo";
import { AccentBar } from "@/components/common/AccentBar";
import { MobileMenuPanel, MobileNavGroup, MobileNavRow } from "./MobileMenu";
import { IRCTC_ECATERING, IRCTC_HOTELS, IRCTC_MAIN } from "@/data/services";

const holidayLinks = [
  { label: "Domestic Packages", note: "Hills, heritage, beaches", category: "Domestic" },
  { label: "International Packages", note: "Air-inclusive escapes", category: "International" },
  { label: "Pilgrimage Circuits", note: "Char Dham, Jyotirlinga", category: "Pilgrimage" },
  { label: "Luxury Trains", note: "Maharajas', Golden Chariot", category: "Luxury Train" },
];

const dishaEvent = "open-disha";
export const openDishaChatbot = () => window.dispatchEvent(new CustomEvent(dishaEvent));
export const DISHA_EVENT = dishaEvent;

export function Header() {
  const { go } = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollToFooter = () => document.getElementById("site-footer")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {/* Utility strip — deliberately OUTSIDE the sticky header so it simply scrolls
          away with the page. Collapsing it inside the header meant fading it out,
          which turned the navy translucent mid-transition and jumped the layout. */}
      <div className="hidden bg-navy text-white/90 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1.5 text-[12px]">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <Phone size={12} /> 24×7 Helpline 14646
            </span>
            <span className="text-white/40">|</span>
            <span>An enterprise of the Ministry of Railways, Govt. of India</span>
          </div>
          <button type="button" className="inline-flex items-center gap-1.5 hover:text-azure">
            <Globe size={12} /> English / हिन्दी
          </button>
        </div>
      </div>

      <header className="sticky top-0 z-50">
        <AccentBar />

        <div className={`transition-all duration-300 ${scrolled ? "glass shadow-lg" : "bg-white"}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 md:px-6">
            <Logo />

            <nav className="hidden items-center gap-0.5 lg:flex">
              <div className="relative" onMouseEnter={() => setOpenMenu("Holidays")} onMouseLeave={() => setOpenMenu(null)}>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold text-foreground/80 transition hover:bg-secondary hover:text-navy"
                >
                  Holidays <ChevronDown size={14} className={`transition ${openMenu === "Holidays" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "Holidays" && (
                  <div className="absolute left-0 top-full w-64 pt-2">
                    <div className="overflow-hidden rounded-2xl border bg-white p-2 shadow-2xl">
                      {holidayLinks.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => go({ name: "world", category: item.category })}
                          type="button"
                          className="flex w-full flex-col items-start rounded-xl px-3 py-2.5 text-left transition hover:bg-secondary"
                        >
                          <span className="text-[14px] font-semibold text-foreground">{item.label}</span>
                          <span className="text-[12px] text-muted-foreground">{item.note}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <NavLink label="Train" href={IRCTC_MAIN} />
              <NavLink label="Food" href={IRCTC_ECATERING} />
              <NavLink label="Rooms" href={IRCTC_HOTELS} />

              <button
                onClick={openDishaChatbot}
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[14px] font-semibold text-foreground/80 transition hover:bg-secondary hover:text-navy"
              >
                <MessageSquareText size={15} /> Ask Disha 2.0
              </button>

              <div className="relative" onMouseEnter={() => setOpenMenu("More")} onMouseLeave={() => setOpenMenu(null)}>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold text-foreground/80 transition hover:bg-secondary hover:text-navy"
                >
                  More <ChevronDown size={14} className={`transition ${openMenu === "More" ? "rotate-180" : ""}`} />
                </button>
                {openMenu === "More" && (
                  <div className="absolute right-0 top-full w-56 pt-2">
                    <div className="overflow-hidden rounded-2xl border bg-white p-2 shadow-2xl">
                      <button
                        onClick={scrollToFooter}
                        type="button"
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-foreground hover:bg-secondary"
                      >
                        Contact us
                      </button>
                      <button
                        onClick={() => go({ name: "world" })}
                        type="button"
                        className="block w-full rounded-xl px-3 py-2.5 text-left text-[14px] font-semibold text-foreground hover:bg-secondary"
                      >
                        Offers &amp; Deals
                      </button>
                      <a
                        href={IRCTC_MAIN}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-semibold text-foreground hover:bg-secondary"
                      >
                        Help &amp; FAQs <ExternalLink size={12} className="text-muted-foreground" />
                      </a>
                      <a
                        href={IRCTC_MAIN}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-semibold text-foreground hover:bg-secondary"
                      >
                        About IRCTC <ExternalLink size={12} className="text-muted-foreground" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-1.5">
              <button aria-label="Search" type="button" className="hidden h-9 w-9 items-center justify-center rounded-full text-navy transition hover:bg-secondary md:flex">
                <Search size={18} />
              </button>
              <button
                onClick={() => go({ name: "madeforyou" })}
                type="button"
                className="hidden rounded-full bg-brand px-4 py-2 text-[13px] font-bold text-white shadow-sm transition hover:brightness-95 md:inline-block"
              >
                Plan my trip
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                type="button"
                aria-label="Open menu"
                className="rounded-lg p-2 text-navy hover:bg-secondary lg:hidden"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-navy p-5 text-white">
              <Logo light />
              <button onClick={() => setMobileOpen(false)} type="button" className="rounded-full p-1.5 hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <MobileMenuPanel>
              <MobileNavGroup
                label="Holidays"
                items={holidayLinks.map((h) => h.label)}
                onPick={(label) => {
                  const picked = holidayLinks.find((h) => h.label === label);
                  go({ name: "world", category: picked?.category });
                  setMobileOpen(false);
                }}
              />
              <MobileNavRow label="Train" external onClick={() => window.open(IRCTC_MAIN, "_blank")} />
              <MobileNavRow label="Food" external onClick={() => window.open(IRCTC_ECATERING, "_blank")} />
              <MobileNavRow label="Rooms" external onClick={() => window.open(IRCTC_HOTELS, "_blank")} />
              <MobileNavRow label="Ask Disha 2.0" onClick={openDishaChatbot} />
              <MobileNavRow
                label="Contact us"
                onClick={() => {
                  scrollToFooter();
                  setMobileOpen(false);
                }}
              />
              <div className="mt-3">
                <button
                  onClick={() => {
                    go({ name: "madeforyou" });
                    setMobileOpen(false);
                  }}
                  type="button"
                  className="w-full rounded-xl bg-brand px-4 py-2.5 text-[14px] font-bold text-white"
                >
                  Plan my trip
                </button>
              </div>
            </MobileMenuPanel>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold text-foreground/80 transition hover:bg-secondary hover:text-navy"
    >
      {label}
      <ExternalLink size={11} className="text-muted-foreground opacity-0 transition group-hover:opacity-100" />
    </a>
  );
}
