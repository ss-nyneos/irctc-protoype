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

/** Slot indices (0–11) inside each Unit that become personal cards instead of photos.
 *  Picked from the short masonry row (260px) so the solid cards don’t feel empty. */
const PERSONAL_SLOTS = [1, 5, 6] as const;

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

/** Extra multiplier on top of the responsive scale, so callers can shrink the
 *  whole masonry (e.g. the /world hero) without touching the profile gallery. */
const DEFAULT_SIZE_SCALE = 1;

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
  const shell =
    "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-4 text-left shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]";

  // Solid saturated fills so cards don't blend into photos / white page.
  // Typography matches MadeForYouPage (font-display, tight tracking).
  if (variant === 0) {
    return (
      <div className={`${shell} bg-[#6D28D9]`} style={{ height }}>
        <p className="relative text-[11.5px] font-medium text-white/70">Made for you</p>
        <div className="relative">
          <p className="text-[12px] font-medium text-white/70">Welcome back,</p>
          <p className="font-display text-[28px] font-bold leading-none tracking-tight text-white">
            {profile.name}
          </p>
          {profile.homeCity && (
            <p className="mt-1.5 text-[11.5px] text-white/65">Exploring from {profile.homeCity}</p>
          )}
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </div>
    );
  }

  if (variant === 1) {
    return (
      <div className={`${shell} bg-[#0F766E]`} style={{ height }}>
        <div className="relative flex items-center gap-1.5 text-white/70">
          <CalendarHeart size={14} />
          <span className="text-[12px] font-medium">Your journey</span>
        </div>
        <div className="relative flex items-end gap-5">
          <div>
            <p className="font-display text-[30px] font-bold leading-none tracking-tight text-white">
              {profile.memberSince}
            </p>
            <p className="mt-1.5 text-[11.5px] text-white/70">
              Member · {years} yrs
            </p>
          </div>
          <div className="mb-1 h-8 w-px bg-white/30" />
          <div>
            <p className="font-display text-[30px] font-bold leading-none tracking-tight text-white">
              {profile.toursCompleted}
            </p>
            <p className="mt-1.5 text-[11.5px] text-white/70">
              {profile.toursCompleted === 1 ? "tour done" : "tours done"}
            </p>
          </div>
        </div>
        <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/25" />
      </div>
    );
  }

  return (
    <div className={`${shell} bg-[#C2410C]`} style={{ height }}>
      <div className="relative flex items-center gap-1.5 text-white/70">
        <Sparkles size={14} />
        <span className="text-[12px] font-medium">Travel style</span>
      </div>
      <div className="relative">
        <p className="font-display text-[24px] font-bold leading-none tracking-tight text-white">
          What you love
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {profile.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11.5px] font-medium text-white ring-1 ring-white/25"
            >
              {tag.toLowerCase().includes("hill") ? (
                <Mountain size={11} />
              ) : tag.toLowerCase().includes("photo") ? (
                <Camera size={11} />
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

/** A photo in the masonry. Either a bare URL, or a URL with a caption title. */
export type GalleryImage = string | { src: string; title?: string };

type NormalizedImage = { src: string; title?: string };

const normalizeImage = (img: GalleryImage): NormalizedImage =>
  typeof img === "string" ? { src: img } : img;

/** A single masonry photo with optional dim overlay and title caption. */
function PhotoCard({ img, height, dim }: { img: NormalizedImage; height: number; dim?: boolean }) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-muted shadow-[0_12px_28px_-16px_rgba(15,32,74,0.35)]"
      style={{ height }}
    >
      <img
        src={img.src}
        alt={img.title ?? ""}
        loading="lazy"
        draggable={false}
        onError={(e) => {
          e.currentTarget.style.opacity = "0";
        }}
        className="pointer-events-none h-full w-full select-none object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />
      {dim && <span className="pointer-events-none absolute inset-0 rounded-lg bg-black/50" />}
      <span className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-black/5" />
      {img.title && (
        <>
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent" />
          <p className="pointer-events-none absolute inset-x-0 bottom-0 p-3.5 text-left font-display text-[15px] font-bold leading-tight tracking-tight text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
            {img.title}
          </p>
        </>
      )}
    </div>
  );
}

interface UnitProps {
  images: NormalizedImage[];
  colW: number;
  heights: number[];
  profile?: GalleryProfile | null;
  /** Darken photos with a black/50 overlay. */
  dim?: boolean;
  
  columns?: number;
}

function Unit({ images, colW, heights, profile, dim, columns }: UnitProps) {
  
  if (columns) {
    const perCol = heights.length;
    return (
      <div className="flex gap-4 p-2">
        {Array.from({ length: columns }, (_, c) => (
          <div key={c} className="flex flex-col gap-4" style={{ width: colW }}>
            {heights.map((_, r) => {
              const img = images[(c * perCol + r) % images.length];
              // Rotate the height set per column so shapes vary (bento) while every
              // column keeps the same total height — needed for seamless tiling.
              const h = heights[(r + c) % perCol];
              return <PhotoCard key={r} img={img} height={h} dim={dim} />;
            })}
          </div>
        ))}
      </div>
    );
  }

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
            const img = images[slot % images.length];
            return <PhotoCard key={r} img={img} height={heights[hi]} dim={dim} />;
          })}
        </div>
      ))}
    </div>
  );
}

interface DragGalleryProps {
  images?: GalleryImage[];
  label?: string;
  className?: string;
  /** When set, 3 personalised cards mix into the masonry. Pass `null` to disable. */
  profile?: GalleryProfile | null;
  /** Darken all photos with a black/50 overlay. */
  dim?: boolean;
  /** Shrink (or grow) the whole masonry. 1 = default; 0.85 = a bit smaller. */
  sizeScale?: number;
  /** Lay each unit out as this many equal-height columns (column-major, every
   *  image used once) so a unit spans the viewport and photos don't repeat on
   *  one screen. Leave unset for the default 4-column masonry. */
  columns?: number;
  /** Where the label pill sits: bottom (default) or vertically centred. */
  labelPosition?: "bottom" | "center";
}

export function DragGallery({
  images = DEFAULT_IMAGES,
  label = "Drag to explore your travel diary",
  className = "h-[78vh] w-full min-h-[520px]",
  profile = DEFAULT_PROFILE,
  dim = false,
  sizeScale = DEFAULT_SIZE_SCALE,
  columns,
  labelPosition = "bottom",
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
      const scale = scaleFor(window.innerWidth) * sizeScale;
      const colW = Math.round(BASE_COL_W * scale);

      // Columns mode: `columns` equal-height columns, each holding perCol rows so
      // every image is placed once. The unit is then `columns` wide.
      const cols4 = columns ?? 4;
      const perCol = columns ? Math.ceil(images.length / columns) : BASE_HEIGHTS.length;
      const heights = Array.from({ length: perCol }, (_, i) =>
        Math.round(BASE_HEIGHTS[i % BASE_HEIGHTS.length] * scale),
      );
      const unitW = cols4 * colW + (cols4 - 1) * GAP + GAP;
      const unitH = heights.reduce((a, b) => a + b, 0) + (perCol - 1) * GAP + GAP;
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
  }, [draw, sizeScale, columns, images.length]);

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

  const [pillHidden, setPillHidden] = useState(false);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    st.dragging = true;
    st.vx = 0;
    st.vy = 0;
    st.lastX = e.clientX;
    st.lastY = e.clientY;
    st.moved = 0;
    setPillHidden(true);
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
    setPillHidden(false);
  };

  const normalizedImages = images.map(normalizeImage);
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
          <Unit key={i} images={normalizedImages} colW={grid.colW} heights={grid.heights} profile={profile} dim={dim} columns={columns} />
        ))}
      </div>

      <div
        ref={pillRef}
        className={`pointer-events-none absolute z-10 -translate-x-1/2 rounded-full bg-white/90 px-5 py-2.5 text-[13px] font-semibold tracking-wide text-ink shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] backdrop-blur-md transition-[opacity,transform] duration-300 ${
          labelPosition === "center" ? "left-1/2 top-1/2 -translate-y-1/2" : "left-1/2 bottom-8"
        } ${pillHidden ? "opacity-0" : labelPosition === "center" ? "opacity-80" : "opacity-100"}`}
      >
        {label}
      </div>
    </div>
  );
}
