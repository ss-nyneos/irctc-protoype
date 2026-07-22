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



const edgeRadius = {
  first: "rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none",
  last: "rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none",
  middle: "",
} as const;

function ComboField({ field, edge }: { field: SearchField; edge: keyof typeof edgeRadius }) {
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
    
    setQuery(null);
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
        // transition-colors, not transition: `transition` animates every
        // property, so the focus ring grew in as well and the field appeared to
        // swell on click.
        // rounded-lg matches the panel's own radius, so the open-state ring and
        // tint follow the corner instead of drawing a square over it. Middle
        // fields simply read as a rounded highlight.
        className={`flex h-full w-full cursor-text items-center gap-3 px-3.5 py-2.5 transition-colors duration-150 ${
          edgeRadius[edge]
        } ${open ? "bg-saffron/5 ring-2 ring-inset ring-saffron" : "hover:bg-black/[0.03]"}`}
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
            // Select on focus so the first keystroke replaces the current
            // choice rather than appending to it.
            onFocus={(e) => {
              if (!open) openList();
              e.currentTarget.select();
            }}
            onKeyDown={onKeyDown}
            className="w-full truncate bg-transparent font-display text-[14px] font-bold text-ink outline-none placeholder:text-ink/45"
          />
        </span>

      
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? "Close options" : "Show options"}
          onClick={(e) => {
            e.stopPropagation();
            if (open) {
              close();
              inputRef.current?.blur();
            } else {
              inputRef.current?.focus();
              openList();
            }
          }}
          className="shrink-0 text-muted-foreground transition-colors hover:text-ink"
        >
          <ChevronDown
            size={15}
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          aria-labelledby={`${id}-label`}
          className="absolute inset-x-0 top-[calc(100%+6px)] z-50 max-h-64 overflow-y-auto rounded-lg border border-border bg-white py-1 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.4)]"
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
          {/* No overflow-hidden here: the option lists are absolutely
              positioned inside these fields, and clipping the panel cut them
              off so a click appeared to do nothing. */}
          <div className="flex min-w-0 flex-1 flex-col divide-y divide-black/10 rounded-lg bg-white shadow-sm lg:flex-row lg:divide-x lg:divide-y-0">
            {fields.map((f, i) => (
              <ComboField
                key={f.key}
                field={f}
                edge={i === 0 ? "first" : i === fields.length - 1 ? "last" : "middle"}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onSearch}
            className="inline-flex flex-none items-center justify-center gap-2 rounded-lg bg-saffron px-5 py-3 font-display text-[17px] font-bold text-white transition-[filter] hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
          >
            <Search size={18} aria-hidden="true" />
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
                  className="h-4 w-4 shrink-0 cursor-pointer rounded-none accent-saffron"
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
