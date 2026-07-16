import { useState } from "react";
import { Check, Headset, Phone } from "lucide-react";

/**
 * Callback request. IRCTC parks this in the sticky right rail, above the fold,
 * where the price ought to be — a lead-gen form outranking the thing the
 * traveller came to do. It earns a section near the bottom instead: by the time
 * you have read the itinerary and the terms, a leftover question is plausible.
 */
export function CallbackForm({ packageName, code }: { packageName: string; code: string }) {
  const [form, setForm] = useState({ name: "", phone: "", query: "" });
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState(false);

  const phoneValid = /^[6-9]\d{9}$/.test(form.phone.trim());
  const nameValid = form.name.trim().length >= 2;
  const showPhoneError = touched && form.phone.length > 0 && !phoneValid;

  if (sent) {
    return (
      <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/60 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check size={22} />
        </span>
        <h2 className="mt-4 font-display text-[20px] font-bold text-ink">We&apos;ll call you back</h2>
        <p className="mx-auto mt-1.5 max-w-md text-[14px] text-foreground/75">
          A tour desk executive will ring {form.phone} within one working day about {packageName} ({code}).
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-4 min-h-[44px] rounded-full px-4 text-[13px] font-semibold text-brand hover:underline"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-secondary/40 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-brand/10 text-brand">
          <Headset size={20} />
        </span>
        <div>
          <h2 className="font-display text-[20px] font-bold text-ink">Still deciding?</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Leave a number and the tour desk will call you back about this package.
          </p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (nameValid && phoneValid) setSent(true);
        }}
        className="mt-5 grid gap-3 sm:grid-cols-2"
      >
        <div>
          <label htmlFor="cb-name" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Your name
          </label>
          <input
            id="cb-name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
            className="h-12 w-full rounded-xl border bg-secondary/30 px-3.5 text-[15px] text-ink outline-none transition focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div>
          <label htmlFor="cb-phone" className="mb-1.5 block text-[13px] font-semibold text-ink">
            Mobile number
          </label>
          <input
            id="cb-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={form.phone}
            onBlur={() => setTouched(true)}
            onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            aria-invalid={showPhoneError}
            aria-describedby="cb-phone-help"
            className={`h-12 w-full rounded-xl border bg-secondary/30 px-3.5 text-[15px] tabular-nums text-ink outline-none transition focus:bg-white focus:ring-2 ${
              showPhoneError
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : "focus:border-brand focus:ring-brand/20"
            }`}
          />
          {/* Helper text holds the slot whether or not it errors, so the row can't jump. */}
          <p
            id="cb-phone-help"
            role={showPhoneError ? "alert" : undefined}
            className={`mt-1.5 text-[12px] ${showPhoneError ? "font-semibold text-destructive" : "text-muted-foreground"}`}
          >
            {showPhoneError ? "Enter a 10-digit Indian mobile number starting 6–9." : "10-digit Indian mobile number."}
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="cb-query" className="mb-1.5 block text-[13px] font-semibold text-ink">
            What would you like to know? <span className="font-medium text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="cb-query"
            rows={3}
            value={form.query}
            onChange={(e) => setForm({ ...form, query: e.target.value })}
            placeholder="Group discounts, boarding at a different station, meal preferences…"
            className="w-full resize-y rounded-xl border bg-secondary/30 p-3.5 text-[15px] text-ink outline-none transition placeholder:text-muted-foreground focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button
            type="submit"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl bg-navy px-6 text-[15px] font-bold text-white transition hover:brightness-110"
          >
            Request a call back
          </button>
          <a
            href="tel:+911139340000"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border px-5 text-[15px] font-semibold text-navy transition hover:bg-secondary"
          >
            <Phone size={15} /> 011-3934-0000
          </a>
        </div>
      </form>
    </div>
  );
}
