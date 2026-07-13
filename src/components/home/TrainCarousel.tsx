import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { LuxuryTrain } from "@/types";
import { useRouter } from "@/router/RouterContext";
import { luxuryTrains } from "@/data/trains";

function TrainCarriage({ train, onClick }: { train: LuxuryTrain; onClick: () => void }) {
  const [broken, setBroken] = useState(false);
  return (
    <button onClick={onClick} type="button" className="group relative shrink-0" style={{ width: 360 }} aria-label={train.name}>
      {/* roof */}
      <div className="mx-2 h-4 rounded-t-2xl bg-gradient-to-b from-[#8a2a37] to-[#5f1c26]" />
      {/* roof vents / AC units */}
      <div className="mx-1 -mt-[3px] flex justify-center gap-14">
        <span className="h-1.5 w-14 rounded-b-md bg-[#2b2f36]" />
        <span className="h-1.5 w-14 rounded-b-md bg-[#2b2f36]" />
      </div>
      {/* body — heritage maroon frame with gold trim */}
      <div
        className="relative h-[280px] overflow-hidden border-x-[7px] border-y-[3px] shadow-2xl"
        style={{
          background: `linear-gradient(135deg, ${train.grad[0]}, ${train.grad[1]})`,
          borderLeftColor: "#6b1f2a",
          borderRightColor: "#6b1f2a",
          borderTopColor: "#cba14b",
          borderBottomColor: "#cba14b",
        }}
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
        <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#e6c565]">{train.tag}</div>
          <div className="font-display text-[24px] font-semibold leading-tight">{train.name}</div>
          <div className="text-[13px] text-white/75">{train.route}</div>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-white/90 opacity-0 transition group-hover:opacity-100">
            Explore journeys <ArrowRight size={14} />
          </span>
        </div>
      </div>
      {/* chassis / underframe */}
      <div className="mx-1.5 h-4 rounded-b-lg bg-gradient-to-b from-[#3b4048] to-[#1d2025]" />
      {/* bogies + steel wheels */}
      <div className="mx-auto flex w-4/5 justify-between px-4">
        {[0, 1].map((g) => (
          <div key={g} className="flex gap-3">
            {[0, 1].map((w) => (
              <span
                key={w}
                className="wheel-spin block h-8 w-8 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, #eef2f6 0 12%, #aab2bc 14% 34%, #565d66 37% 70%, #23272d 73% 100%)",
                  boxShadow: "inset 0 1px 2px rgba(255,255,255,.4), 0 2px 3px rgba(0,0,0,.4)",
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </button>
  );
}

function Coupler() {
  return <div className="mx-[-6px] mt-[150px] h-2.5 w-6 shrink-0 self-start rounded bg-[#2b2f36]" />;
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
      {/* railway track */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[10px] z-0">
        {/* wooden sleepers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3">
          {Array.from({ length: 44 }).map((_, i) => (
            <span key={i} className="h-4 w-2 rounded-sm bg-[#7c6a4f]/80" />
          ))}
        </div>
        {/* steel rail */}
        <div
          className="absolute bottom-[7px] h-[5px] w-full rounded-full"
          style={{
            background: "linear-gradient(180deg, #d3dae1 0%, #9aa2ac 45%, #5c636c 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,.3)",
          }}
        />
      </div>
      <div className="relative z-10 overflow-hidden py-2">
        <div className="train-marquee flex w-max items-start gap-0">
          <TrainRow onPick={pick} />
          <TrainRow onPick={pick} />
        </div>
      </div>
    </div>
  );
}
