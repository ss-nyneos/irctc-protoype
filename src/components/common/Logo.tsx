import { useRouter } from "@/router/RouterContext";
import irctcLogo from "@/assets/irctc-logo.png";

export function Logo({ light = false }: { light?: boolean }) {
  const { go } = useRouter();
  return (
    <button onClick={() => go({ name: "home" })} className="group flex items-center gap-2.5" type="button">
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        <img src={irctcLogo} alt="IRCTC" className="h-7 w-7 object-contain" />
      </div>
      <div className="text-left leading-none">
        <div className="font-display text-[19px] font-bold tracking-tight drop-shadow-[0_1px_1.5px_rgba(15,23,42,0.2)]">
          <span className="bg-gradient-to-r from-[#FF9933] to-[#FB8C00] bg-clip-text text-transparent">IRCTC</span>{" "}
          <span className="text-[#138808]">Tourism</span>
        </div>
        <div className={`text-[10px] font-medium tracking-wide ${light ? "text-white/70" : "text-muted-foreground"}`}>
          भारतीय रेल · Ministry of Railways
        </div>
      </div>
    </button>
  );
}
