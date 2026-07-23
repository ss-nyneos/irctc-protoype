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
    onAdjust?: () => void;
}

/** Boarding-pass summary of customiser answers — same Helvetica stack as CustomisePage. */
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
    ],
    whatsNextTitle = "What's next",
    whatsNext = ["6 handpicked trips for you", "Best prices & availability", "Real photos & verified stays"],
    onAdjust,
}: TripPassProps) {
    return (
        <div
            className="relative grid w-full grid-cols-1 overflow-hidden rounded-[22px]
                 border border-ink/10 bg-white font-sans text-ink antialiased
                 shadow-[0_1px_2px_rgba(17,26,46,.04),0_12px_34px_rgba(17,26,46,.08)]
                 md:grid-cols-[1fr_360px]"
        >
            {/* main body */}
            <div className="p-6 sm:p-8">
                <div className="mb-[22px] flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{brand}</span>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
                        <Check /> {verifiedLabel}
                    </span>
                </div>

                <div className="mb-1.5 flex items-center gap-[18px]">
                    <div className="min-w-0">
                        <div className="font-sans text-[16px] font-semibold text-[#323232]">From</div>
                        <div className="truncate font-display text-[30px] font-bold leading-[1.1] tracking-tight text-ink">{from}</div>
                    </div>
                    <div className="flex flex-1 items-center gap-2 text-saffron">
                        <span className="h-[7px] w-[7px] rounded-full bg-saffron" />
                        <span className="flex-1 border-t-2 border-dashed border-ink/15" />
                        <Train className="shrink-0" />
                        <span className="flex-1 border-t-2 border-dashed border-ink/15" />
                        <span className="h-[7px] w-[7px] rounded-full bg-saffron" />
                    </div>
                    <div className="min-w-0 text-right">
                        <div className="font-sans text-[16px] font-semibold text-[#323232]">To</div>
                        <div className="truncate font-display text-[30px] font-bold leading-[1.1] tracking-tight text-ink">{to}</div>
                    </div>
                </div>

                <p className="mb-[26px] mt-1 text-[14px] leading-normal text-muted-foreground">{caption}</p>

                <div className="grid grid-cols-2 gap-x-[18px] gap-y-[22px] sm:grid-cols-4">
                    {fields.map((f, i) => (
                        <div key={i} className="min-w-0">
                            <div className="mb-1 font-sans text-[16px] font-semibold text-[#323232]">
                                {f.label}
                            </div>
                            <div
                                className={`break-words font-sans text-[16px] font-semibold text-[#323232] ${
                                    f.code ? "font-mono tracking-[0.06em] tabular-nums" : ""
                                }`}
                                title={f.value}
                            >
                                {f.value}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* stub */}
            <aside
                className="relative z-10 flex min-h-[220px] flex-col bg-navy p-[30px_26px] font-sans text-white
                   before:pointer-events-none before:absolute before:z-0 before:bg-[radial-gradient(circle_at_10px_10px,transparent_6px,#fff_6.5px)]
                   before:bg-[length:20px_20px] before:bg-center
                   before:left-0 before:right-0 before:top-[-10px] before:h-5
                   md:before:bottom-0 md:before:left-[-10px] md:before:right-auto md:before:top-0 md:before:h-auto md:before:w-5"
            >
                <h3 className="relative z-10 mb-4 font-sans text-[16px] font-semibold text-[#FFFFFF]">
                    {whatsNextTitle}
                </h3>
                <div className="relative z-10 flex flex-col">
                    {whatsNext.map((item, i) => (
                        <div key={i} className="mb-3 flex items-start gap-2.5 font-sans text-[16px] font-semibold leading-snug text-[#FFFFFF]">
                            <Check className="mt-px shrink-0 text-saffron" />
                            <span className="text-[#FFFFFF]">{item}</span>
                        </div>
                    ))}
                </div>

                {onAdjust && (
                    <div className="relative z-10 mt-auto shrink-0 pt-6">
                        <button
                            onClick={onAdjust}
                            type="button"
                            className="w-full min-w-[105px] rounded-full bg-[#2475EE] px-[1.15rem] py-[0.72rem]
                         text-[16px] font-medium leading-[154%] tracking-[0em] text-[#FFFFFF] transition hover:bg-[#1450B4]"
                        >
                            Adjust
                        </button>
                    </div>
                )}
            </aside>
        </div>
    );
}
