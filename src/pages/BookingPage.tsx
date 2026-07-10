import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  CreditCard,
  Download,
  MapPin,
  Moon,
  PartyPopper,
  Shield,
  Sparkles,
  User,
  Wallet,
} from "lucide-react";
import { useReveal } from "@/hooks/useReveal";
import { useRouter } from "@/router/RouterContext";
import { packages, getPackageById } from "@/data/packages";
import { formatINR } from "@/utils/format";
import { ImageWithFallback } from "@/components/common/ImageWithFallback";
import { AccentBar } from "@/components/common/AccentBar";

const steps = ["Traveller details", "Review & pay", "Confirmed"];

export function BookingPage({ id }: { id: string }) {
  const { back, go } = useRouter();
  const ref = useReveal();
  const pkg = getPackageById(id) ?? packages[0];

  const [step, setStep] = useState(0);
  const travellers = 2;
  const [payOption, setPayOption] = useState<"full" | "part">(pkg.price * travellers > 50000 ? "part" : "full");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const total = pkg.price * travellers;
  const partAmount = Math.round(total * 0.25);
  const dueAmount = total - partAmount;
  const bookingRef = "IRCTC" + Math.random().toString(36).slice(2, 8).toUpperCase();

  const canContinue = step !== 0 || (form.name && form.phone.length >= 10);

  return (
    <div ref={ref} className="min-h-screen bg-secondary/40 pb-24">
      <div className="bg-navy text-white">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
          <button onClick={back} type="button" className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/80 hover:text-white">
            <ArrowLeft size={15} /> Back
          </button>
          <div className="flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 items-center gap-2">
                <div
                  className={`flex h-8 w-8 flex-none items-center justify-center rounded-full text-[13px] font-bold transition ${
                    i < step ? "bg-emerald-500 text-white" : i === step ? "bg-brand text-white" : "bg-white/15 text-white/60"
                  }`}
                >
                  {i < step ? <Check size={15} /> : i + 1}
                </div>
                <span className={`hidden text-[13px] font-semibold sm:block ${i <= step ? "text-white" : "text-white/50"}`}>{label}</span>
                {i < steps.length - 1 && <div className={`h-0.5 flex-1 rounded ${i < step ? "bg-emerald-500" : "bg-white/15"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>
      <AccentBar />

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
        {step < 2 ? (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="min-w-0">
              {step === 0 && (
                <div className="reveal rounded-3xl border bg-white p-6 shadow-sm">
                  <h2 className="heading-xl flex items-center gap-2 text-ink">
                    <User size={32} /> Lead traveller
                  </h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">We&apos;ll send your itinerary &amp; confirmation here.</p>
                  <div className="mt-5 space-y-4">
                    <FormField
                      label="Full name (as per ID)"
                      value={form.name}
                      onChange={(v) => setForm({ ...form, name: v })}
                      placeholder="e.g. Rahul Himalayan"
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        label="Mobile number"
                        value={form.phone}
                        onChange={(v) => setForm({ ...form, phone: v.replace(/\D/g, "").slice(0, 10) })}
                        placeholder="10-digit mobile"
                      />
                      <FormField label="Email address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="you@email.com" />
                    </div>
                    <div className="rounded-xl bg-secondary/60 p-3 text-[12px] text-muted-foreground">
                      Additional {travellers - 1} traveller detail(s) can be added after payment, up to 30 days before departure.
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="reveal space-y-4">
                  <div className="rounded-3xl border bg-white p-6 shadow-sm">
                    <h2 className="heading-xl flex items-center gap-2 text-ink">
                      <Wallet size={32} /> Payment option
                    </h2>
                    <div className="mt-4 space-y-3">
                      {total > 50000 && (
                        <PayOptionCard
                          active={payOption === "part"}
                          onClick={() => setPayOption("part")}
                          title="Part payment · 25% now"
                          sub={`Pay ${formatINR(partAmount)} today, ${formatINR(dueAmount)} up to 30 days before departure`}
                          tag="Popular"
                        />
                      )}
                      <PayOptionCard active={payOption === "full"} onClick={() => setPayOption("full")} title="Pay in full" sub={`Pay ${formatINR(total)} now · lock your booking instantly`} />
                    </div>
                    <div className="mt-5">
                      <div className="mb-2 text-[13px] font-semibold text-ink">Payment method</div>
                      <div className="grid grid-cols-3 gap-2">
                        {["UPI", "Card", "Net Banking"].map((m, i) => (
                          <button
                            key={m}
                            type="button"
                            className={`flex items-center justify-center gap-1.5 rounded-xl border py-3 text-[13px] font-semibold ${
                              i === 0 ? "border-brand bg-brand/5 text-brand" : "hover:border-brand/40"
                            }`}
                          >
                            <CreditCard size={14} /> {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl border bg-white p-4 text-[13px] text-foreground/70 shadow-sm">
                    <Shield size={18} className="flex-none text-emerald-600" />
                    Payments are processed through IRCTC&apos;s secure government gateway. No card details are stored.
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between">
                <button onClick={() => (step === 0 ? back() : setStep(0))} type="button" className="rounded-xl border px-5 py-3 text-[14px] font-bold text-ink hover:bg-white">
                  {step === 0 ? "Cancel" : "Back"}
                </button>
                <button
                  onClick={() => (step === 0 ? setStep(1) : setStep(2))}
                  disabled={!canContinue}
                  type="button"
                  className="rounded-xl bg-brand px-7 py-3 text-[15px] font-bold text-white shadow-lg transition hover:brightness-95 disabled:opacity-40"
                >
                  {step === 0 ? "Continue to payment" : `Pay ${formatINR(payOption === "part" ? partAmount : total)}`}
                </button>
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                <ImageWithFallback img={pkg.img} grad={pkg.grad} alt={pkg.name} className="h-32" />
                <div className="p-5">
                  <div className="font-display text-[16px] font-semibold leading-tight text-ink">{pkg.name}</div>
                  <div className="mt-2 flex flex-wrap gap-3 text-[12px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} />
                      {pkg.region}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Moon size={12} />
                      {pkg.nights}N/{pkg.days}D
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <User size={12} />
                      {travellers} pax
                    </span>
                  </div>
                  <div className="my-4 border-t" />
                  <div className="space-y-1.5 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Package × {travellers}</span>
                      <span className="font-semibold">{formatINR(total)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700">
                      <span>GST &amp; fees</span>
                      <span className="font-semibold">Included</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t pt-2">
                      <span className="font-bold text-ink">Total</span>
                      <span className="font-display text-[22px] font-bold text-ink">{formatINR(total)}</span>
                    </div>
                    {step === 1 && payOption === "part" && (
                      <div className="mt-2 rounded-xl bg-brand/10 p-2.5 text-[12px] text-brand">
                        <div className="flex justify-between font-bold">
                          <span>Pay now (25%)</span>
                          <span>{formatINR(partAmount)}</span>
                        </div>
                        <div className="flex justify-between text-foreground/60">
                          <span>Due before departure</span>
                          <span>{formatINR(dueAmount)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="reveal mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-3xl border bg-white text-center shadow-xl">
              <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 px-6 py-10 text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 pulse-ring">
                  <PartyPopper size={32} />
                </div>
                <h2 className="heading-xl mt-4 text-white">Booking confirmed!</h2>
                <p className="mt-1 text-[14px] text-white/85">
                  Your journey is reserved. A confirmation has been sent to {form.email || "your email"}.
                </p>
              </div>
              <div className="p-6">
                <div className="rounded-2xl border-2 border-dashed border-brand/20 p-4">
                  <div className="text-[12px] text-muted-foreground">Booking reference</div>
                  <div className="font-display text-[26px] font-bold tracking-wider text-ink">{bookingRef}</div>
                </div>

                <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
                  <SummaryTile label="Tour" value={pkg.name} />
                  <SummaryTile label="Traveller" value={form.name || "Lead traveller"} />
                  <SummaryTile label="Duration" value={`${pkg.nights}N / ${pkg.days}D`} />
                  <SummaryTile label="Travellers" value={`${travellers} person(s)`} />
                  <SummaryTile label="Amount paid" value={formatINR(payOption === "part" ? partAmount : total)} />
                  {payOption === "part" && <SummaryTile label="Balance due" value={`${formatINR(dueAmount)} · before departure`} />}
                </div>

                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <button type="button" className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand px-5 py-3 text-[14px] font-bold text-brand transition hover:bg-brand hover:text-white">
                    <Download size={16} /> Download voucher
                  </button>
                  <button
                    onClick={() => go({ name: "home" })}
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3 text-[14px] font-bold text-white shadow transition hover:brightness-95"
                  >
                    <Sparkles size={16} /> Explore more tours
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-muted-foreground">
              <Calendar size={13} /> Add-on traveller details can be completed anytime in &quot;Manage booking&quot;.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-ink">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border bg-white px-4 py-3 text-[14px] outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/10"
      />
    </label>
  );
}

function PayOptionCard({
  active,
  onClick,
  title,
  sub,
  tag,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sub: string;
  tag?: string;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${
        active ? "border-brand bg-brand/5" : "hover:border-brand/40"
      }`}
    >
      <span className={`mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${active ? "border-brand bg-brand text-white" : "border-muted"}`}>
        {active && <Check size={12} />}
      </span>
      <span className="flex-1">
        <span className="flex items-center gap-2 text-[15px] font-bold text-ink">
          {title} {tag && <span className="text-[11px] font-semibold text-brand">· {tag}</span>}
        </span>
        <span className="text-[13px] text-muted-foreground">{sub}</span>
      </span>
    </button>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary/50 p-3">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="text-[14px] font-bold text-ink">{value}</div>
    </div>
  );
}
