import type { SVGProps } from "react";

const Check = (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d="M20 6 9 17l-5-5" />
    </svg>
);
const Train = (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M4 11h16M8 16l-2 4M16 16l2 4" />
        <circle cx="8.5" cy="8" r=".6" />
        <circle cx="15.5" cy="8" r=".6" />
    </svg>
);
const Arrow = (p: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
        <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
);

interface TripPassField {
    label: string;
    value: string;
    code?: boolean;
}

interface TripPassProps {
    brand?: string;
    verifiedLabel?: string;
    from?: string;
    to?: string;
    caption?: string;
    fields?: TripPassField[];
    whatsNextTitle?: string;
    whatsNext?: string[];
    ctaLabel?: string;
    onShowTrips?: () => void;
    onAdjust?: () => void;
}

/** A boarding-pass-style summary of the finished trip customiser — replaces the old
 *  plain "Done!" card with a ticket/pass metaphor (route strip, perforated stub). */
export default function TripPass({
    brand = "IRCTC Tourism · Trip pass",
    verifiedLabel = "Verified itinerary",
    from = "Anywhere",
    to = "Hills",
    caption = "We matched your preferences with our premium, verified stays.",
    fields = [
        { label: "Travellers", value: "2 · Couple" },
        { label: "Duration", value: "7–9 Days" },
        { label: "Transport", value: "Train" },
        { label: "Stay", value: "Standard" },
        { label: "Interests", value: "Open to all" },
        { label: "Pass no.", value: "WL-7749-HL", code: true },
    ],
    whatsNextTitle = "What's next",
    whatsNext = ["6 handpicked trips for you", "Best prices & availability", "Real photos & verified stays"],
    ctaLabel = "Show my trips",
    onShowTrips = () => {},
    onAdjust,
}: TripPassProps) {
    return (
        <div
            style={{ fontFamily: "var(--tp-font, 'Inter', system-ui, sans-serif)" }}
            className="relative grid w-full grid-cols-1 overflow-hidden rounded-[22px]
                 border border-[#EDEFF5] bg-white text-[#111A2E] antialiased
                 shadow-[0_1px_2px_rgba(17,26,46,.04),0_12px_34px_rgba(17,26,46,.08)]
                 md:grid-cols-[1fr_360px]"
        >
            {/* main body */}
            <div className="p-6 sm:p-8">
                <div className="mb-[22px] flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7385]">{brand}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                        <Check /> {verifiedLabel}
                    </span>
                </div>

                <div className="mb-1.5 flex items-center gap-[18px]">
                    <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7385]">From</div>
                        <div className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em]">{from}</div>
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-[#FF7A45]">
                        <span className="h-[7px] w-[7px] rounded-full bg-[#FF7A45]" />
                        <span className="flex-1 border-t-2 border-dashed border-[#D8DEEA]" />
                        <Train className="shrink-0" />
                        <span className="flex-1 border-t-2 border-dashed border-[#D8DEEA]" />
                        <span className="h-[7px] w-[7px] rounded-full bg-[#FF7A45]" />
                    </div>
                    <div className="text-right">
                        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B7385]">To</div>
                        <div className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em]">{to}</div>
                    </div>
                </div>

                <p className="mb-[26px] mt-1 text-sm leading-normal text-[#6B7385]">{caption}</p>

                <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] sm:grid-cols-4">
                    {fields.map((f, i) => (
                        <div key={i}>
                            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7385]">
                                {f.label}
                            </div>
                            <div
                                className={`text-[15px] font-semibold text-[#111A2E] ${
                                    f.code ? "tracking-[0.06em] tabular-nums" : ""
                                }`}
                            >
                                {f.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* stub */}
            <aside
                className="relative flex flex-col bg-[#111A2E] p-[30px_26px] text-white
                   before:absolute before:bg-[radial-gradient(circle_at_10px_10px,transparent_6px,#fff_6.5px)]
                   before:bg-[length:20px_20px] before:bg-center
                   before:left-0 before:right-0 before:top-[-10px] before:h-5
                   md:before:bottom-0 md:before:left-[-10px] md:before:right-auto md:before:top-0 md:before:h-auto md:before:w-5"
            >
                <h3 className="mb-4 text-[15px] font-bold">{whatsNextTitle}</h3>
                <div className="flex flex-col">
                    {whatsNext.map((item, i) => (
                        <div key={i} className="mb-3 flex items-start gap-2.5 text-[13.5px] leading-snug text-[#D5D9E6]">
                            <Check className="mt-px shrink-0 text-[#F4B740]" />
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-auto flex gap-2.5 pt-4">
                    {onAdjust && (
                        <button
                            onClick={onAdjust}
                            type="button"
                            className="rounded-xl border border-white/30 px-[18px] py-3 text-[15px] font-semibold
                         text-white transition hover:border-white/60"
                        >
                            Adjust
                        </button>
                    )}
                    <button
                        onClick={onShowTrips}
                        type="button"
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2B5CFF]
                       px-[18px] py-3 text-[15px] font-semibold text-white transition
                       hover:-translate-y-px hover:bg-[#1B3FCC]"
                    >
                        {ctaLabel} <Arrow />
                    </button>
                </div>
            </aside>
        </div>
    );
}
