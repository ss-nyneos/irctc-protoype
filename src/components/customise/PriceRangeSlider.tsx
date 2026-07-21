import { useState, useId } from "react";

interface PriceRangeSliderProps {
    min?: number;
    max?: number;
    step?: number;
    /** Controlled value. Omit for an uncontrolled slider that manages its own state. */
    value?: number;
    /** Initial value when uncontrolled. */
    defaultValue?: number;
    /** Heading text shown above the track. */
    label?: string;
    /** Symbol prefix for the default formatter. */
    currency?: string;
    onChange?: (nextValue: number) => void;
    /** Custom formatter for the bubble and end labels, overriding `currency`. */
    formatValue?: (n: number) => string;
}

/**
 * PriceRangeSlider
 * A single-thumb price slider with a tapered ("wedge") orange fill,
 * a floating value bubble, and min/max end labels.
 */
export default function PriceRangeSlider({
    min = 10000,
    max = 50000,
    step = 1000,
    value: controlledValue,
    defaultValue = 15000,
    label = "Price",
    currency = "₹",
    onChange,
    formatValue,
}: PriceRangeSliderProps) {
    const id = useId();
    const isControlled = controlledValue != null;
    const [internal, setInternal] = useState(defaultValue);
    const value = isControlled ? (controlledValue as number) : internal;

    const percent = ((value - min) / (max - min)) * 100;

    const fmt = (n: number) => (formatValue ? formatValue(n) : `${currency}${n.toLocaleString("en-IN")}`);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = Number(e.target.value);
        if (!isControlled) setInternal(next);
        onChange?.(next);
    };

    return (
        <div className="prs-card">
            <style>{css}</style>

            {label && (
                <>
                    <div className="prs-head">{label}</div>
                    <div className="prs-divider" />
                </>
            )}

            <div className="prs-slider">
                {/* Floating value bubble */}
                <div
                    className="prs-bubble"
                    style={{
                        left: `${percent}%`,
                        transform: `translate(-${percent}%, -100%)`,
                    }}
                    aria-hidden="true"
                >
                    {fmt(value)}
                    <span
                        className="prs-bubble-arrow"
                        style={{
                            left: `${percent}%`,
                        }}
                    />
                </div>

                {/* Track + tapered fill */}
                <div className="prs-track">
                    <div className="prs-fill" style={{ width: `${percent}%` }} />
                </div>

                {/* Native input handles drag, keyboard, a11y */}
                <input
                    id={id}
                    type="range"
                    className="prs-input"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={handleChange}
                    aria-label={label}
                    aria-valuetext={fmt(value)}
                />
            </div>

            <div className="prs-ends">
                <span>{fmt(min)}</span>
                <span>{fmt(max)}</span>
            </div>
        </div>
    );
}

const BRAND_BLUE = "#2475ee";
const css = `
.prs-card {
  --brand-blue: ${BRAND_BLUE};
  --track: #e4e4e7;
  box-sizing: border-box;
  width: 100%;
  padding: 20px 24px 22px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: #fff;
}
.prs-card *, .prs-card *::before, .prs-card *::after { box-sizing: border-box; }

.prs-head {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}
.prs-divider {
  height: 1px;
  background: #e9e9ee;
  margin: 14px -24px 0;
}

.prs-slider {
  position: relative;
  height: 60px;
  margin-top: 34px;
  display: flex;
  align-items: center;
}

/* --- gray base track --- */
.prs-track {
  position: relative;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--track);
  overflow: visible;
}

/* --- tapered blue wedge: needle-thin on the left, full height at the thumb --- */
.prs-fill {
  position: absolute;
  left: 0;
  top: 50%;
  height: 18px;
  transform: translateY(-50%);
  background: var(--brand-blue);
  border-radius: 2px 999px 999px 2px;
  clip-path: polygon(0 50%, 100% 0, 100% 100%);
  pointer-events: none;
  transition: width .05s linear;
}

/* --- floating value bubble --- */
.prs-bubble {
  position: absolute;
  top: -6px;
  background: var(--brand-blue);
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 4px 10px rgba(36, 117, 238, .28);
}
.prs-bubble-arrow {
  position: absolute;
  bottom: -5px;
  width: 12px;
  height: 12px;
  background: var(--brand-blue);
  transform: translateX(-50%) rotate(45deg);
  border-radius: 2px;
}

/* --- native range styled as an invisible interaction layer + visible thumb --- */
.prs-input {
  position: absolute;
  left: 0;
  width: 100%;
  height: 60px;
  margin: 0;
  background: transparent;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
}
.prs-input:focus { outline: none; }

/* thumb */
.prs-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-blue);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.25);
  cursor: pointer;
}
.prs-input::-moz-range-thumb {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-blue);
  border: 3px solid #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,.25);
  cursor: pointer;
}
.prs-input::-moz-range-track { background: transparent; }

/* visible keyboard focus */
.prs-input:focus-visible::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(36, 117, 238, .35), 0 2px 6px rgba(0,0,0,.25);
}
.prs-input:focus-visible::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(36, 117, 238, .35), 0 2px 6px rgba(0,0,0,.25);
}

/* --- end labels --- */
.prs-ends {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 15px;
  color: #374151;
}

@media (prefers-reduced-motion: reduce) {
  .prs-fill { transition: none; }
}
`;
