import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { DISHA_EVENT } from "@/components/layout/Header";
import { packages, getPackageById } from "@/data/packages";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { RatingBadge } from "@/components/common/RatingBadge";
import { formatINR } from "@/utils/format";
import type { TourPackage, View } from "@/types";

/* ─────────────────────────── conversation engine ───────────────────────────
   Disha is a self-contained (no-backend) planner. It keeps a small preference
   memory (theme + budget) across turns, understands free text *and* quick-reply
   chips, recommends a real package from the catalogue, and — when the traveller
   asks to open or book something by name — navigates there for them. */

interface Prefs {
  theme?: string;
  maxPrice?: number;
  budgetKnown?: boolean;
}

interface Chip {
  label: string;
  /** Feed this back as if the user typed it (drives the conversation). */
  send?: string;
  /** Navigate somewhere and close the chat. */
  go?: View;
  primary?: boolean;
}

interface Message {
  role: "ai" | "user";
  text?: string;
  chips?: Chip[];
  /** Renders an inline package preview card. */
  pkgId?: string;
}

/** Travel "vibes" mapped to how they match the catalogue + the explore filter. */
const THEMES: { key: string; label: string; send: string; category?: string; re: RegExp; match: (p: TourPackage) => boolean }[] = [
  { key: "pilgrimage", label: "Pilgrimage", send: "pilgrimage", category: "Pilgrimage", re: /(pilgrim|temple|darshan|char ?dham|spiritual|yatra|jyotirlinga|balaji|shirdi|tirupati)/, match: (p) => p.category === "Pilgrimage" || p.experience.includes("spiritual") },
  { key: "hills", label: "Hills & nature", send: "hills and nature", category: "Hills", re: /(hill|mountain|nature|valley|tea garden|snow|scenic)/, match: (p) => p.category === "Hills" || p.experience.includes("nature") },
  { key: "beach", label: "Beaches", send: "beaches", category: "Beach", re: /(beach|island|sea|coast|scuba|snorkel)/, match: (p) => p.category === "Beach" },
  { key: "wildlife", label: "Wildlife", send: "wildlife", category: "Wildlife", re: /(wildlife|safari|jungle|tiger|rhino|forest)/, match: (p) => p.category === "Wildlife" },
  { key: "heritage", label: "Heritage", send: "heritage", category: "Heritage", re: /(heritage|fort|palace|culture|history)/, match: (p) => p.category === "Heritage" || p.experience.includes("culture") },
  { key: "luxury", label: "Luxury trains", send: "luxury trains", category: "Luxury Train", re: /(luxury|maharaja|palace on wheels|deccan|luxury train)/, match: (p) => p.category === "Luxury Train" || p.experience.includes("luxury") },
  { key: "international", label: "International", send: "international", category: "International", re: /(international|abroad|foreign|overseas|visa)/, match: (p) => p.category === "International" },
  { key: "honeymoon", label: "Honeymoon", send: "honeymoon", category: undefined, re: /(honeymoon|romantic|couple|anniversary)/, match: (p) => p.experience.includes("honeymoon") },
];

/** Destination / package keywords → package id (checked longest-first). */
const PKG_ALIASES: [string, string][] = [
  ["char dham", "chardham"], ["chardham", "chardham"], ["kedarnath", "chardham"], ["badrinath", "chardham"],
  ["kerala", "keralabackwaters"], ["munnar", "keralabackwaters"], ["alleppey", "keralabackwaters"], ["backwater", "keralabackwaters"],
  ["dakshin", "dakshinbharat"], ["balaji", "dakshinbharat"], ["tirupati", "dakshinbharat"], ["rameswaram", "dakshinbharat"],
  ["north east", "northeastsafari"], ["northeast", "northeastsafari"], ["kaziranga", "northeastsafari"], ["shillong", "northeastsafari"], ["meghalaya", "northeastsafari"],
  ["mysore", "mysorecoorg"], ["coorg", "mysorecoorg"], ["ooty", "mysorecoorg"],
  ["odisha", "odishagolden"], ["puri", "odishagolden"], ["konark", "odishagolden"], ["bhubaneswar", "odishagolden"],
  ["andaman", "andaman"], ["havelock", "andaman"], ["port blair", "andaman"],
  ["jyotirlinga", "jyotirlinga"], ["shirdi", "jyotirlinga"], ["statue of unity", "jyotirlinga"],
  ["rajasthan", "rajasthan"], ["jaipur", "rajasthan"], ["jodhpur", "rajasthan"], ["udaipur", "rajasthan"],
  ["sri lanka", "srilanka"], ["srilanka", "srilanka"], ["colombo", "srilanka"], ["kandy", "srilanka"],
  ["singapore", "singaporemalaysia"], ["malaysia", "singaporemalaysia"], ["kuala lumpur", "singaporemalaysia"],
];

const NAV_VERB = /\b(open|go to|goto|take me|redirect|navigate|show me|view|see|book|reserve|visit)\b/;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function findPackage(text: string): string | null {
  for (const [kw, id] of PKG_ALIASES) if (text.includes(kw)) return id;
  return null;
}

function parseBudget(text: string): { maxPrice?: number } {
  let maxPrice: number | undefined;
  if (/\bpremium\b/.test(text)) maxPrice = 100000;
  else if (/\bcomfort\b/.test(text)) maxPrice = 35000;
  else if (/\b(value|cheap|affordable|economical|budget-friendly)\b/.test(text)) maxPrice = 22000;

  const withUnit = text.match(/₹?\s*(\d[\d,]*)\s*(k|thousand|lakhs?|l)\b/);
  const bare = text.match(/₹?\s*(\d[\d,]{3,})\b/);
  let n: number | undefined;
  if (withUnit) {
    n = parseInt(withUnit[1].replace(/,/g, ""), 10);
    n = /k|thousand/.test(withUnit[2]) ? n * 1000 : n * 100000; // k vs lakh/l
  } else if (bare) {
    n = parseInt(bare[1].replace(/,/g, ""), 10);
  }
  if (n && n >= 1000) maxPrice = n;
  return { maxPrice };
}

/** Value score — great rating, gently penalised by price, so cheap+loved wins. */
const valueScore = (p: TourPackage) => p.rating - p.price / 2_000_000;

function recommend(prefs: Prefs): { pick?: TourPackage; count: number } {
  let list = packages.slice();
  const theme = prefs.theme ? THEMES.find((t) => t.key === prefs.theme) : undefined;
  if (theme) list = list.filter(theme.match);
  if (prefs.maxPrice) list = list.filter((p) => p.price <= prefs.maxPrice!);
  list.sort((a, b) => valueScore(b) - valueScore(a));
  return { pick: list[0], count: list.length };
}

const THEME_CHIPS: Chip[] = [...THEMES.map((t) => ({ label: t.label, send: t.send })), { label: "Surprise me", send: "surprise me" }];
const BUDGET_CHIPS: Chip[] = [
  { label: "Budget · ≤₹25k", send: "under 25000" },
  { label: "Mid · ≤₹50k", send: "under 50000" },
  { label: "Premium · ≤₹1L", send: "under 100000" },
  { label: "No limit", send: "any budget" },
];

const themeQuestion = (text: string): Message => ({ role: "ai", text, chips: THEME_CHIPS });

function budgetQuestion(themeKey?: string): Message {
  const label = THEMES.find((t) => t.key === themeKey)?.label ?? "That";
  return { role: "ai", text: `${cap(label)} — lovely pick! What's your budget per person?`, chips: BUDGET_CHIPS };
}

function recommendReply(prefs: Prefs, intro?: string): { messages: Message[]; prefs: Prefs } {
  const { pick, count } = recommend(prefs);
  if (!pick) {
    return {
      prefs,
      messages: [
        {
          role: "ai",
          text: "I couldn't find a match within that budget. Want me to show the closest options instead?",
          chips: [
            { label: "Show closest", send: `${THEMES.find((t) => t.key === prefs.theme)?.send ?? "best"} any budget` },
            { label: "See everything", go: { name: "world" } },
          ],
        },
      ],
    };
  }
  const themeCat = THEMES.find((t) => t.key === prefs.theme)?.category;
  const others = count - 1;
  const ceiling = prefs.maxPrice ? ` under ${formatINR(prefs.maxPrice)}` : "";
  return {
    prefs,
    messages: [
      { role: "ai", text: intro ?? `Based on what you told me, this is my top pick${ceiling}:` },
      {
        role: "ai",
        pkgId: pick.id,
        text: pick.aiReason,
        chips: [
          { label: "View details", go: { name: "detail", id: pick.id }, primary: true },
          { label: "Book now", go: { name: "booking", id: pick.id } },
          ...(others > 0 ? [{ label: `See ${others} more`, go: { name: "world", category: themeCat } as View }] : []),
        ],
      },
    ],
  };
}

/** Core turn handler: interpret one user utterance against current prefs. */
function buildReply(raw: string, prefs: Prefs): { messages: Message[]; prefs: Prefs; navigate?: View } {
  const text = raw.toLowerCase();

  if (/\b(reset|start over|restart|clear|change)\b/.test(text)) {
    return { prefs: {}, messages: [themeQuestion("Fresh start! What kind of getaway are you dreaming of?")] };
  }

  // 1) Named a destination / package → navigate if they asked, else show its card.
  const pkgId = findPackage(text);
  if (pkgId) {
    const pkg = getPackageById(pkgId)!;
    if (NAV_VERB.test(text)) {
      const booking = /\b(book|reserve)\b/.test(text);
      return {
        prefs,
        navigate: { name: booking ? "booking" : "detail", id: pkg.id },
        messages: [{ role: "ai", text: `On it — opening ${pkg.name}${booking ? " to book" : ""} for you now.` }],
      };
    }
    return {
      prefs,
      messages: [
        { role: "ai", text: `Great choice — here's ${pkg.name}:` },
        {
          role: "ai",
          pkgId: pkg.id,
          text: pkg.blurb,
          chips: [
            { label: "View details", go: { name: "detail", id: pkg.id }, primary: true },
            { label: "Book now", go: { name: "booking", id: pkg.id } },
          ],
        },
      ],
    };
  }

  // 2) Absorb any preferences mentioned this turn.
  const next: Prefs = { ...prefs };
  const theme = THEMES.find((t) => t.re.test(text));
  if (theme) next.theme = theme.key;
  const { maxPrice } = parseBudget(text);
  if (maxPrice) {
    next.maxPrice = maxPrice;
    next.budgetKnown = true;
  }
  if (/(any budget|no limit|no budget|flexible|doesn'?t matter|whatever)/.test(text)) {
    next.maxPrice = undefined;
    next.budgetKnown = true;
  }

  // 3) "Surprise me / best value" → recommend straight away.
  if (/\b(surprise|best value|recommend|suggest|popular|top pick|anything)\b/.test(text) && !next.theme) {
    next.budgetKnown = true;
    return recommendReply(next, "Here's what travellers are loving most right now:");
  }

  // 4) Guided next step.
  if (!next.theme) return { prefs: next, messages: [themeQuestion("Tell me the vibe — what kind of trip are you after?")] };
  if (!next.budgetKnown) return { prefs: next, messages: [budgetQuestion(next.theme)] };
  return recommendReply(next);
}

/* ─────────────────────────────── UI ─────────────────────────────── */

function PkgCard({ id }: { id: string }) {
  const pkg = getPackageById(id);
  if (!pkg) return null;
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-24 w-full" overlay={false} />
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <RatingBadge value={pkg.rating} reviews={pkg.reviews} />
          <span className="text-[11px] font-semibold text-muted-foreground">
            {pkg.nights}N · {pkg.days}D
          </span>
        </div>
        <div className="mt-1 font-display text-[14px] font-semibold leading-snug text-ink">{pkg.name}</div>
        <div className="text-[11px] text-muted-foreground">{pkg.region}</div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[15px] font-bold text-ink">{formatINR(pkg.price)}</span>
          {pkg.oldPrice && <span className="text-[11px] text-muted-foreground line-through">{formatINR(pkg.oldPrice)}</span>}
          <span className="text-[10px] text-muted-foreground">/ person</span>
        </div>
      </div>
    </div>
  );
}

export function DishaChatbot() {
  const { go } = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const prefsRef = useRef<Prefs>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        { role: "ai", text: "Namaste! I'm Disha 2.0, your IRCTC travel companion. I'll find your perfect trip in a couple of taps." },
        themeQuestion("What kind of getaway are you dreaming of?"),
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(DISHA_EVENT, onOpen);
    return () => window.removeEventListener(DISHA_EVENT, onOpen);
  }, []);

  const submit = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setThinking(true);

    const { messages: aiMsgs, prefs, navigate } = buildReply(trimmed, prefsRef.current);
    prefsRef.current = prefs;

    window.setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, ...aiMsgs]);
      if (navigate) {
        window.setTimeout(() => {
          go(navigate);
          setOpen(false);
        }, 750);
      }
    }, 650);
  };

  const followChip = (chip: Chip) => {
    if (chip.go) {
      go(chip.go);
      setOpen(false);
      return;
    }
    if (chip.send) submit(chip.send);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
       
        style={{ bottom: "calc(1.25rem + var(--dock-offset, 0px))" }}
        className={`pulse-ring fixed right-5 z-40 flex items-center gap-2.5 rounded-full bg-brand py-3.5 pl-4 pr-5 text-left text-white shadow-2xl transition-[bottom,filter] duration-300 hover:brightness-95 ${
          open ? "hidden" : ""
        }`}
      >
        <Sparkles size={20} className="flex-none" />
        <span className="hidden leading-tight sm:block">
          {/* <span className="block text-[13px] font-bold">Don&apos;t know what to choose?</span> */}
          <span className="block text-[13px] font-bold text-white/85">Ask Disha 2.0 — we&apos;re here to help!</span>
        </span>
      </button>

      {open && (
        <div className="fixed inset-x-2 bottom-2 top-14 z-50 flex flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl sm:inset-x-auto sm:bottom-5 sm:right-5 sm:top-auto sm:h-[600px] sm:max-h-[85vh] sm:w-[400px]">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="text-[14px] font-bold">Disha 2.0</div>
                <div className="flex items-center gap-1 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> AI travel planner · online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} type="button" aria-label="Close chat" className="rounded-full p-1.5 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[86%] space-y-2">
                  {m.pkgId && <PkgCard id={m.pkgId} />}
                  {m.text && (
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                        m.role === "user" ? "bg-brand text-white" : "bg-white text-foreground shadow-sm"
                      }`}
                    >
                      {m.text}
                    </div>
                  )}
                  {m.chips && (
                    <div className="flex flex-wrap gap-1.5">
                      {m.chips.map((chip) => (
                        <button
                          key={chip.label}
                          onClick={() => followChip(chip)}
                          type="button"
                          className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                            chip.primary
                              ? "border-brand bg-brand text-white hover:brightness-95"
                              : "border-brand/20 bg-white text-brand hover:bg-brand hover:text-white"
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-white px-3.5 py-3 shadow-sm">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand/50" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit(input)}
                placeholder="Try “beach trip under 40k” or “open Golden Chariot”"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              />
              <button
                onClick={() => submit(input)}
                type="button"
                aria-label="Send message"
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-white disabled:opacity-40"
                disabled={!input.trim() || thinking}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
