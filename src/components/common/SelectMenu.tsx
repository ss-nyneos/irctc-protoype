import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  /** Second line under the label — a fare, a time, anything secondary. */
  hint?: string;
  disabled?: boolean;
}

interface SelectMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  /** Shown when nothing is selected yet. */
  placeholder?: string;
  /** Labels the trigger for screen readers when there's no visible <label>. */
  ariaLabel?: string;
  id?: string;
  /** Compact trigger: no border, right-aligned — for sitting inside a row. */
  bare?: boolean;
  /** Draws the trigger in the error colour and marks it invalid for AT. */
  invalid?: boolean;
  /** id of the help/error text this trigger is described by. */
  describedBy?: string;
  className?: string;
}

/**
 * A listbox that replaces the native <select>. The native control can't be
 * styled past its border — the popup is drawn by the OS — so a long, priced
 * option list (occupancy, boarding chains) renders as raw system UI in the
 * middle of a designed form.
 *
 * Keyboard and ARIA follow the APG listbox pattern, so this stays as usable as
 * the element it replaces: arrows move, Home/End jump, Enter/Space commit,
 * Escape closes, and typing letters jumps to a matching option.
 */
export function SelectMenu({
  value,
  onChange,
  options,
  placeholder = "Select",
  ariaLabel,
  id,
  bare = false,
  invalid = false,
  describedBy,
  className = "",
}: SelectMenuProps) {
  const generatedId = useId();
  const listId = `${id ?? generatedId}-listbox`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  /** Drop upward when the trigger sits too low for the panel to fit below. */
  const [dropUp, setDropUp] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const typed = useRef({ query: "", at: 0 });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // Opening lands on the current selection, not the top of the list.
  useEffect(() => {
    if (open) setActive(selectedIndex >= 0 ? selectedIndex : firstEnabled(options));
  }, [open, selectedIndex, options]);

  // Measured before paint so the panel never flashes in the wrong place.
  useLayoutEffect(() => {
    if (!open) return;
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom;
    setDropUp(below < 260 && rect.top > below);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const dismiss = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    // A dropdown pinned to its trigger has to close when the page moves under
    // it — but scrolling the option list is not the page moving, and closing on
    // that made the list impossible to scroll. Same containment test as the
    // outside-click, so events from inside the panel are left alone.
    // Capture phase throughout: scroll doesn't bubble, and a handler that stops
    // propagation elsewhere on the page must not swallow the dismiss.
    document.addEventListener("pointerdown", dismiss, true);
    window.addEventListener("scroll", dismiss, true);
    return () => {
      document.removeEventListener("pointerdown", dismiss, true);
      window.removeEventListener("scroll", dismiss, true);
    };
  }, [open]);

  // Keep the active option in view while arrowing through a long list.
  useEffect(() => {
    if (!open || active < 0) return;
    listRef.current?.querySelectorAll("li")[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const commit = (i: number) => {
    const option = options[i];
    if (!option || option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const step = (from: number, dir: 1 | -1) => {
    for (let i = from + dir; i >= 0 && i < options.length; i += dir) {
      if (!options[i].disabled) return i;
    }
    return from;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) return setOpen(true);
        setActive((a) => step(a, e.key === "ArrowDown" ? 1 : -1));
        return;
      }
      case "Home":
        if (!open) return;
        e.preventDefault();
        return setActive(firstEnabled(options));
      case "End":
        if (!open) return;
        e.preventDefault();
        return setActive(step(options.length, -1));
      case "Enter":
      case " ":
        e.preventDefault();
        if (!open) return setOpen(true);
        return commit(active);
      case "Escape":
        if (!open) return;
        e.preventDefault();
        return setOpen(false);
      case "Tab":
        setOpen(false);
        return;
      default: {
        // Type-ahead: letters typed within a second are treated as one prefix.
        if (e.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey) return;
        const now = Date.now();
        typed.current.query = now - typed.current.at > 1000 ? e.key : typed.current.query + e.key;
        typed.current.at = now;
        const q = typed.current.query.toLowerCase();
        const hit = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(q));
        if (hit < 0) return;
        if (open) setActive(hit);
        else commit(hit);
      }
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-controls={listId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={
          bare
            ? "inline-flex max-w-full items-center gap-1.5 rounded-lg py-2 text-[13px] font-semibold text-ink outline-none transition hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/25"
            : `flex h-12 w-full items-center gap-2 rounded-xl border bg-white px-3.5 text-left text-[15px] outline-none transition
               ${
                 invalid
                   ? "border-destructive focus-visible:ring-2 focus-visible:ring-destructive/20"
                   : "border-black/40 hover:border-black/60 focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
               }
               ${open && !invalid ? "border-brand ring-2 ring-brand/20" : ""}`
        }
      >
        <span className={`min-w-0 flex-1 truncate ${selected ? "text-ink" : "text-muted-foreground"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          size={bare ? 14 : 17}
          className={`flex-none text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onKeyDown={onKeyDown}
          className={`slim-scrollbar absolute z-50 max-h-[288px] w-full min-w-[240px] origin-top overscroll-contain overflow-y-auto rounded-xl border border-black/40 bg-white p-1.5 shadow-xl shadow-black/[0.08]
            ${bare ? "right-0 w-max max-w-[280px]" : ""}
            ${dropUp ? "bottom-full mb-1.5" : "top-full mt-1.5"}`}
          style={{ animation: "selectMenuIn 140ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                // Pointer, not click: the trigger's focus must survive the press.
                onPointerDown={(e) => {
                  e.preventDefault();
                  commit(i);
                }}
                onPointerEnter={() => !o.disabled && setActive(i)}
                className={`flex cursor-pointer items-start gap-2.5 rounded-lg px-3 py-2.5 text-[14px] leading-snug transition-colors
                  ${o.disabled ? "cursor-not-allowed text-muted-foreground/50" : ""}
                  ${i === active && !o.disabled ? "bg-secondary/70" : ""}
                  ${isSelected ? "font-semibold text-brand" : "text-ink"}`}
              >
                <span className="min-w-0 flex-1">
                  {o.label}
                  {o.hint && <span className="mt-0.5 block text-[12.5px] font-normal text-muted-foreground">{o.hint}</span>}
                </span>
                {isSelected && <Check size={15} className="mt-0.5 flex-none text-brand" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function firstEnabled(options: SelectOption[]) {
  const i = options.findIndex((o) => !o.disabled);
  return i < 0 ? -1 : i;
}
