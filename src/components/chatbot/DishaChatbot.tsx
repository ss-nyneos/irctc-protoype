import { useEffect, useRef, useState, type ReactNode } from "react";
import { Compass, Send, Sparkles, Wallet, X, CircleUserRound } from "lucide-react";
import { useRouter } from "@/router/RouterContext";
import { DISHA_EVENT } from "@/components/layout/Header";
import type { View } from "@/types";

interface Chip {
  label: string;
  go: View;
}

interface Message {
  role: "ai" | "user";
  text: string;
  chips?: Chip[];
}

function replyFor(input: string): Message {
  const text = input.toLowerCase();

  if (/(budget|cheap|price|afford|money)/.test(text)) {
    return {
      role: "ai",
      text: "Let's tailor tours to your budget. Set your spend, climate and travel style and I'll match the best fits.",
      chips: [{ label: "Open budget planner", go: { name: "customise" } }],
    };
  }
  if (/(pilgrim|temple|darshan|char dham|spiritual|yatra)/.test(text)) {
    return {
      role: "ai",
      text: "We have priority-darshan circuits like Char Dham and Dakshin Bharat Yatra with veg meals and escorts. Want to see them?",
      chips: [{ label: "View pilgrimages", go: { name: "world" } }],
    };
  }
  if (/(luxury|maharaja|palace|golden chariot|train)/.test(text)) {
    return {
      role: "ai",
      text: "India's luxury trains — Maharajas' Express, Golden Chariot and more — offer butler service and fine dining. Take a look:",
      chips: [{ label: "Luxury trains", go: { name: "detail", id: "maharajas" } }],
    };
  }
  if (/(honeymoon|couple|romantic)/.test(text)) {
    return {
      role: "ai",
      text: "For a honeymoon I'd suggest Kashmir, Kerala backwaters or the Andamans. Shall I show my top pick?",
      chips: [{ label: "Kashmir Paradise", go: { name: "detail", id: "kashmir" } }],
    };
  }
  return {
    role: "ai",
    text: "Great — the quickest way is to set a few preferences and let me build matching tours for you.",
    chips: [{ label: "Plan my trip", go: { name: "customise" } }],
  };
}

export function DishaChatbot() {
  const { go } = useRouter();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: "ai",
          text: "Namaste! I'm your IRCTC travel planner. Tell me what you're looking for, or start with one of these:",
          chips: [
            { label: "Best value tours", go: { name: "world" } },
            { label: "Plan by budget", go: { name: "customise" } },
            { label: "Picks for me", go: { name: "madeforyou" } },
          ],
        },
      ]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(DISHA_EVENT, onOpen);
    return () => window.removeEventListener(DISHA_EVENT, onOpen);
  }, []);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    const reply = replyFor(trimmed);
    setTimeout(() => setMessages((prev) => [...prev, reply]), 500);
  };

  const followChip = (chip: Chip) => {
    go(chip.go);
    setOpen(false);
  };

  const quickChips: { icon: ReactNode; label: string; go: View }[] = [
    { icon: <Compass size={12} />, label: "Best value", go: { name: "world" } },
    { icon: <Wallet size={12} />, label: "By budget", go: { name: "customise" } },
    { icon: <CircleUserRound size={12} />, label: "For me", go: { name: "madeforyou" } },
  ];

  return (
    <>
      <button
        onClick={() => go({ name: "customise" })}
        type="button"
        className={`pulse-ring fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full bg-brand py-3.5 pl-4 pr-5 text-left text-white shadow-2xl transition hover:brightness-95 ${
          open ? "hidden" : ""
        }`}
      >
        <Sparkles size={20} className="flex-none" />
        <span className="hidden leading-tight sm:block">
          <span className="block text-[13px] font-bold">Don&apos;t know what to choose?</span>
          <span className="block text-[11px] font-medium text-white/85">We&apos;re here to help!</span>
        </span>
      </button>

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[540px] w-[92vw] max-w-[380px] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-brand px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <Sparkles size={18} />
              </span>
              <div>
                <div className="text-[14px] font-bold">IRCTC Travel Planner</div>
                <div className="flex items-center gap-1 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> AI · online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} type="button" className="rounded-full p-1.5 hover:bg-white/10">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-secondary/30 p-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.role === "user" ? "bg-brand text-white" : "bg-white text-foreground shadow-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.chips && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.chips.map((chip) => (
                        <button
                          key={chip.label}
                          onClick={() => followChip(chip)}
                          type="button"
                          className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-[12px] font-semibold text-brand transition hover:bg-brand hover:text-white"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="border-t bg-white p-3">
            <div className="mb-2 flex gap-1.5">
              {quickChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => followChip(chip)}
                  type="button"
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-brand/10"
                >
                  {chip.icon}
                  {chip.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-full border bg-white px-3 py-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about tours, budget, dates…"
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              />
              <button onClick={send} type="button" className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand text-white">
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
