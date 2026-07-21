import { useEffect, useRef, useState, useCallback } from "react";
import { CalendarHeart, Camera, Mountain, Sparkles } from "lucide-react";

import andamanImg from "@/assets/places/andaman nicobar.webp";
import ayodhyaImg from "@/assets/places/ayodhya.jpeg";
import bazaarImg from "@/assets/places/bazaar walks.jpeg";
import keralaImg from "@/assets/places/coastal keralam or boating type.webp";
import foodImg from "@/assets/places/food thali.jpg";
import gangtokImg from "@/assets/places/gangtok.jpeg";
import harmandarImg from "@/assets/places/harmandar sahib.webp";
import havelockImg from "@/assets/places/havelock.jpg";
import hyderabadImg from "@/assets/places/hyderabad.webp";
import jaipurImg from "@/assets/places/jaipur .jpg";
import kashmirImg from "@/assets/places/kashmir.jpg";
import kathakaliImg from "@/assets/places/kathakali.webp";
import rishikeshImg from "@/assets/places/rishikesh.jpg";
import southYatraImg from "@/assets/places/south-yatra.webp";
import srisailamImg from "@/assets/places/srisailam.webp";
import varanasiImg from "@/assets/places/varanasi.jpg";
import venkateshwaraImg from "@/assets/places/venkateshwara mandir.jpg";
import { demoUser, pastTours } from "@/data/mockProfile";

/* ---- config ---- */
const GAP = 16;
const BASE_COL_W = 360;
const BASE_HEIGHTS = [380, 260, 440];
const PERMS = [
  [0, 1, 2],
  [2, 0, 1],
  [1, 2, 0],
  [2, 1, 0],
];

/** Slot indices (0–11) inside each Unit that become personal cards instead of photos. */
const PERSONAL_SLOTS = [2, 5, 9] as const;

const DEFAULT_IMAGES = [
  kashmirImg,
  jaipurImg,
  varanasiImg,
  rishikeshImg,
  gangtokImg,
  andamanImg,
  havelockImg,
  keralaImg,
  hyderabadImg,
  ayodhyaImg,
  harmandarImg,
  southYatraImg,
  bazaarImg,
  foodImg,
  kathakaliImg,
  srisailamImg,
  venkateshwaraImg,
];

const scaleFor = (w: number) => (w < 640 ? 0.7 : w < 1000 ? 0.88 : 1);

export type GalleryProfile = {
  name: string;
  memberSince: number;
  toursCompleted: number;
  tags: string[];
  homeCity?: string;
};

const DEFAULT_PROFILE: GalleryProfile = {
  name: demoUser.name,
  memberSince: demoUser.memberSince,
  toursCompleted: pastTours.length,
  tags: demoUser.tags,
  homeCity: demoUser.homeCity,
};

function PersonalCard({
  variant,
  height,
  profile,
}: {
  variant: 0 | 1 | 2;
  height: number;
  profile: GalleryProfile;
}) {
  const years = new Date().getFullYear() - profile.memberSince;

  // Solid saturated fills so cards don't blend into photos / white page.
  // Typography matches MadeForYouPage (font-display, tight tracking).
  if (variant === 0) {
    return (
      <div
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#6D28D9] p-5 text-left shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]"
        style={{ height }}
      >
        <p className="relative text-[12.5px] font-medium text-white/70">Made for you</p>
        <div className="relative">
          <p className="text-[13px] font-medium text-white/70">Welcome back,</p>
          <p className="font-display text-[38px] font-bold leading-none tracking-tight text-white">
            {profile.name}
          </p>
          {profile.homeCity && (
            <p className="mt-2.5 text-[12.5px] text-white/65">Exploring from {profile.homeCity}</p>
          )}
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </div>
    );
  }

  if (variant === 1) {
    return (
      <div
        className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#0F766E] p-5 text-left shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]"
        style={{ height }}
      >
        <div className="relative flex items-center gap-2 text-white/70">
          <CalendarHeart size={15} />
          <span className="text-[13px] font-medium">Your journey</span>
        </div>
        <div className="relative space-y-4">
          <div>
            <p className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
              {profile.memberSince}
            </p>
            <p className="mt-2.5 text-[12.5px] text-white/70">
              Member since · {years} yrs with us
            </p>
          </div>
          <div className="h-px w-16 bg-white/30" />
          <div>
            <p className="font-display text-[42px] font-bold leading-none tracking-tight text-white">
              {profile.toursCompleted}
            </p>
            <p className="mt-2.5 text-[12.5px] text-white/70">
              {profile.toursCompleted === 1 ? "tour completed" : "tours completed"}
            </p>
          </div>
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#C2410C] p-5 text-left shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]"
      style={{ height }}
    >
      <div className="relative flex items-center gap-2 text-white/70">
        <Sparkles size={15} />
        <span className="text-[13px] font-medium">Travel style</span>
      </div>
      <div className="relative">
        <p className="font-display text-[32px] font-bold leading-none tracking-tight text-white">
          What you love
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-[12.5px] font-medium text-white ring-1 ring-white/25"
            >
              {tag.toLowerCase().includes("hill") ? (
                <Mountain size={12} />
              ) : tag.toLowerCase().includes("photo") ? (
                <Camera size={12} />
              ) : null}
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
    </div>
  );
}

interface UnitProps {
  images: string[];
  colW: number;
  heights: number[];
  profile?: GalleryProfile | null;
}

function Unit({ images, colW, heights, profile }: UnitProps) {
  let k = 0;
  return (
    <div className="flex gap-4 p-2">
      {PERMS.map((perm, c) => (
        <div key={c} className="flex flex-col gap-4" style={{ width: colW }}>
          {perm.map((hi, r) => {
            const slot = k++;
            const personalIdx = (PERSONAL_SLOTS as readonly number[]).indexOf(slot);
            if (profile && personalIdx !== -1) {
              return (
                <PersonalCard
                  key={`p-${r}`}
                  variant={personalIdx as 0 | 1 | 2}
                  height={heights[hi]}
                  profile={profile}
                />
              );
            }
            const imgSrc = images[slot % images.length];
            return (
              <div
                key={r}
                className="group relative overflow-hidden rounded-2xl bg-muted shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]"
                style={{ height: heights[hi] }}
              >
                <img
                  src={imgSrc}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.opacity = "0";
                  }}
                  className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface DragGalleryProps {
  images?: string[];
  label?: string;
  className?: string;
  /** When set, 3 personalised cards mix into the masonry. Pass `null` to disable. */
  profile?: GalleryProfile | null;
}

export function DragGallery({
  images = DEFAULT_IMAGES,
  label = "Drag to explore your travel diary",
  className = "h-[78vh] w-full min-h-[520px]",
  profile = DEFAULT_PROFILE,
}: DragGalleryProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const s = useRef({
    tx: 0,
    ty: 0,
    vx: 0,
    vy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    moved: 0,
    unitW: 0,
    unitH: 0,
  });

  const [grid, setGrid] = useState({
    cols: 0,
    rows: 0,
    colW: BASE_COL_W,
    heights: BASE_HEIGHTS,
  });

  const draw = useCallback(() => {
    const { tx, ty, unitW, unitH } = s.current;
    const board = boardRef.current;
    if (!board || !unitW) return;
    const x = (((tx % unitW) + unitW) % unitW) - unitW;
    const y = (((ty % unitH) + unitH) % unitH) - unitH;
    board.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }, []);

  useEffect(() => {
    const layout = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const scale = scaleFor(window.innerWidth);
      const colW = Math.round(BASE_COL_W * scale);
      const heights = BASE_HEIGHTS.map((h) => Math.round(h * scale));
      const unitW = 4 * colW + 3 * GAP + GAP;
      const unitH = heights.reduce((a, b) => a + b, 0) + 2 * GAP + GAP;
      s.current.unitW = unitW;
      s.current.unitH = unitH;
      const cols = Math.ceil(wrap.clientWidth / unitW) + 2;
      const rows = Math.ceil(wrap.clientHeight / unitH) + 2;
      s.current.tx = -unitW * 0.28;
      s.current.ty = -unitH * 0.35;
      setGrid({ cols, rows, colW, heights });
      draw();
    };
    layout();
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [draw]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const tick = () => {
      const st = s.current;
      if (!reduce && !st.dragging && (Math.abs(st.vx) > 0.08 || Math.abs(st.vy) > 0.08)) {
        st.tx += st.vx;
        st.ty += st.vy;
        st.vx *= 0.93;
        st.vy *= 0.93;
        draw();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  const setPill = (visible: boolean) => {
    const pill = pillRef.current;
    if (!pill) return;
    pill.style.opacity = visible ? "1" : "0";
    pill.style.transform = visible ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.92)";
  };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.dragging = true;
    st.vx = 0;
    st.vy = 0;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.moved = 0;
    setPill(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (!st.dragging) return;
    const dx = e.clientX - st.lastX;
    const dy = e.clientY - st.lastY;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.tx += dx;
    st.ty += dy;
    st.vx = dx;
    st.vy = dy;
    st.moved += Math.abs(dx) + Math.abs(dy);
    draw();
  };

  const onUp = () => {
    const st = s.current;
    if (!st.dragging) return;
    st.dragging = false;
    if (st.moved < 4) setPill(true);
  };

  const cells = Array.from({ length: grid.cols * grid.rows }, (_, i) => i);

  return (
    <div
      ref={wrapRef}
      className={`relative cursor-grab touch-none select-none overflow-hidden bg-white active:cursor-grabbing ${className}`}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <div
        ref={boardRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ display: "grid", gridTemplateColumns: `repeat(${grid.cols}, auto)` }}
      >
        {cells.map((i) => (
          <Unit key={i} images={images} colW={grid.colW} heights={grid.heights} profile={profile} />
        ))}
      </div>

      <div
        ref={pillRef}
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[opacity,transform] duration-300"
      >
        {label}
      </div>
    </div>
  );
}
