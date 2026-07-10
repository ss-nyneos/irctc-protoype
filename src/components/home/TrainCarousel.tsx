import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { LuxuryTrain } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { luxuryTrains } from "@/data/trains";

function TrainCarriage({ train, onClick }: { train: LuxuryTrain; onClick: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button onClick={onClick} type="button" className="group relative shrink-0" style={{ width: 268 }} aria-label={train.name}>
      <div className="mx-2 h-3 rounded-t-xl bg-[#0a1f4a]" />
      <div className="mx-1 flex justify-center gap-6">
        <span className="-mt-1 h-1.5 w-8 rounded-b bg-[#0a1f4a]" />
        <span className="-mt-1 h-1.5 w-8 rounded-b bg-[#0a1f4a]" />
      </div>
      <div
        className="relative h-[210px] overflow-hidden rounded-xl border-x-[6px] border-[#122f63] bg-[#122f63] shadow-2xl"
        style={{ background: `linear-gradient(135deg, ${train.grad[0]}, ${train.grad[1]})` }}
      >
        {!broken && (
          <img
            src={train.img}
            alt={train.name}
            loading="lazy"
            onError={() => setBroken(true)}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,.14) 0 2px, transparent 2px 33.3%, rgba(255,255,255,.14) 33.3% calc(33.3% + 2px), transparent calc(33.3% + 2px) 66.6%, rgba(255,255,255,.14) 66.6% calc(66.6% + 2px), transparent calc(66.6% + 2px))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/25" />
        <div className="absolute inset-x-0 bottom-0 p-3.5 text-left text-white">
          <div className="text-[10px] font-bold uppercase tracking-wider text-azure">{train.tag}</div>
          <div className="font-display text-[19px] font-semibold leading-tight">{train.name}</div>
          <div className="text-[11px] text-white/75">{train.route}</div>
          <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-white/90 opacity-0 transition group-hover:opacity-100">
            Explore journeys <ArrowRight size={12} />
          </span>
        </div>
      </div>
      <div className="mx-1.5 h-2.5 rounded-b-md bg-[#0a1f4a]" />
      <div className="mx-auto flex w-3/4 justify-between px-2">
        {[0, 1].map((g) => (
          <div key={g} className="flex gap-2">
            {[0, 1].map((w) => (
              <span
                key={w}
                className="wheel-spin mt-0.5 block h-5 w-5 rounded-full border-[3px] border-[#0a1f4a] bg-[#33405c]"
                style={{ backgroundImage: "radial-gradient(circle, #64748b 30%, transparent 32%)" }}
              />
            ))}
          </div>
        ))}
      </div>
    </button>
  );
}

function Coupler() {
  return <div className="mx-[-6px] mt-[120px] h-2 w-5 shrink-0 self-start rounded bg-[#0a1f4a]" />;
}

function TrainRow({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="flex items-start">
      {luxuryTrains.map((train) => (
        <div key={train.id} className="flex items-start">
          <Coupler />
          <TrainCarriage train={train} onClick={() => onPick(train.id)} />
        </div>
      ))}
      <Coupler />
    </div>
  );
}

export function TrainCarousel() {
  const { go } = useRouter();

  const pick = (id: string) => {
    const known = ["maharajas", "goldenchariot"];
    go(known.includes(id) ? { name: "detail", id } : { name: "world" });
  };

  return (
    <div className="train-stage relative">
      <div className="pointer-events-none absolute inset-x-0 bottom-[6px] z-0">
        <div className="h-[3px] w-full bg-[#5b6470]" />
        <div className="mt-[7px] h-[6px] w-full bg-[#243356]" />
        <div className="absolute bottom-3 left-0 right-0 flex justify-between">
          {Array.from({ length: 60 }).map((_, i) => (
            <span key={i} className="h-3 w-2 bg-[#324066]" />
          ))}
        </div>
      </div>
      <div className="relative z-10 overflow-hidden py-2">
        <div className="train-marquee flex w-max items-start gap-0">
          <TrainRow onPick={pick} />
          <TrainRow onPick={pick} />
        </div>
      </div>
      <div className="mt-3 text-center text-[12px] text-white/45">
        Hover to pause · tap a carriage to explore its journeys
      </div>
    </div>
  );
}
