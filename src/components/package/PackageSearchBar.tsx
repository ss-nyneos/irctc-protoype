import type { LucideIcon } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export type SearchChoice = { value: string; label: string };

export type SearchField = {
  key: string;
  label: string;
  icon: LucideIcon;
  value: string;
  options: SearchChoice[];
  onChange: (value: string) => void;
};

export type QuickToggle = {
  label: string;
  active: boolean;
  onToggle: () => void;
};

/**
 * A searchable select — type to narrow, arrow to pick.
 *
 * Two earlier attempts are worth recording. A native <select> cannot work here:
 * browsers draw the option list themselves, so no CSS reaches it and the popup
 * arrives with square corners, its own highlight colour and its own metrics
 * against rounded brand-blue fields. A plain custom listbox fixed the looks but
 * still made you hunt a long list of cities by eye. So the trigger is a text
 * input: it shows the current choice at rest, and filters as soon as you type.
 *
 * `query === null` means "not searching, show the selection". An empty string
 * means "searching, but nothing typed yet" — which is why the two are distinct
 * rather than one falsy check.
 */
function ComboField({ field }: { field: SearchField }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const [highlight, setHighlight] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const current = field.options.find((o) => o.value === field.value) ?? field.options[0];

  const visible = useMemo(() => {
    if (!query) return field.options;
    const q = query.trim().toLowerCase();
    return field.options.filter((o) => o.label.toLowerCase().includes(q));
  }, [field.options, query]);

  const close = () => {
    setOpen(false);
    setQuery(null);
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Keep the highlighted row in view when arrowing past the visible window.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector(`[data-index="${highlight}"]`)?.scrollIntoView({ block: "nearest" });
  }, [highlight, open]);

  const openList = () => {
    setHighlight(Math.max(0, field.options.findIndex((o) => o.value === field.value)));
    setQuery("");
    setOpen(true);
  };

  const choose = (index: number) => {
    const picked = visible[index];
    if (!picked) return;
    field.onChange(picked.value);
    close();
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "Tab") {
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setHighlight(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHighlight(visible.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(highlight);
    }
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div
        onClick={() => {
          inputRef.current?.focus();
          if (!open) openList();
        }}
        // No box of its own: the fields share one white container and are told
        // apart by the divider between them, so only focus draws an outline.
        className={`flex h-full w-full cursor-text items-center gap-3 px-3.5 py-2.5 transition ${
          open ? "bg-saffron/5 ring-2 ring-inset ring-saffron" : "hover:bg-black/[0.03]"
        }`}
      >
        <field.icon size={17} className="shrink-0 text-brand" aria-hidden="true" />

        <span className="min-w-0 flex-1">
          <label
            id={`${id}-label`}
            htmlFor={`${id}-input`}
            className="block cursor-text text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {field.label}
          </label>

          <input
            ref={inputRef}
            id={`${id}-input`}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={open && visible.length ? `${id}-option-${highlight}` : undefined}
            value={query ?? current.label}
            placeholder={current.label}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlight(0);
              if (!open) setOpen(true);
            }}
            onFocus={() => !open && openList()}
            onKeyDown={onKeyDown}
            className="w-full truncate bg-transparent font-display text-[14px] font-bold text-ink outline-none placeholder:text-ink/45"
          />
        </span>

        <ChevronDown
          size={15}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </div>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-md border border-border bg-white py-1 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.4)]"
        >
          {visible.map((o, i) => {
            const isSelected = o.value === field.value;
            return (
              <li
                key={o.value}
                id={`${id}-option-${i}`}
                data-index={i}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHighlight(i)}
                // mousedown fires before the outside-click handler can close us.
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(i)}
                className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2 text-[14px] transition-colors ${
                  i === highlight ? "bg-secondary" : "bg-white"
                } ${isSelected ? "font-bold text-navy" : "font-medium text-ink"}`}
              >
                <span className="truncate">{o.label}</span>
                {isSelected && <Check size={14} className="shrink-0 text-brand" aria-hidden="true" />}
              </li>
            );
          })}

          {visible.length === 0 && (
            <li className="px-3.5 py-3 text-[13px] text-muted-foreground">
              No match for “{query}”
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

/**
 * The booking strip, in IRCTC's own idiom: a solid navy band directly under the
 * hero carrying the few choices that narrow a catalogue fastest, with the deeper
 * filter panel still available beside the results.
 *
 * Every control drives real filter state — the grid narrows as you change it, so
 * the button just jumps to the results rather than pretending to run a search
 * that already happened.
 */
export function PackageSearchBar({
  fields,
  quick,
  onSearch,
}: {
  fields: SearchField[];
  quick: QuickToggle[];
  onSearch: () => void;
}) {
  return (
    // z-30 so the open dropdowns clear the results section beneath.
    <section aria-label="Search packages" className="relative z-30 w-full bg-navy">
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {/* One panel, not four: the fields are divided by a hairline rather
              than floated apart, so the strip reads as a single control. */}
          <div className="flex min-w-0 flex-1 flex-col divide-y divide-black/10 rounded-md bg-white shadow-sm lg:flex-row lg:divide-x lg:divide-y-0">
            {fields.map((f) => (
              <ComboField key={f.key} field={f} />
            ))}
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-saffron px-5 py-3 font-display text-[15px] font-bold text-white transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Search size={16} aria-hidden="true" />
            Search
          </button>
        </div>

        {quick.length > 0 && (
          <div className="mt-3.5 flex flex-wrap items-center gap-x-7 gap-y-2">
            {quick.map((q) => (
              <label
                key={q.label}
                className="inline-flex cursor-pointer select-none items-center gap-2.5 text-[13px] font-semibold text-white/85 transition hover:text-white"
              >
                <input
                  type="checkbox"
                  checked={q.active}
                  onChange={q.onToggle}
                  className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-saffron"
                />
                {q.label}
              </label>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
