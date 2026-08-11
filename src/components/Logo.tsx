import Link from "next/link";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 group">
      <div className="w-9 h-9 rounded-xl bg-gradient-palmon flex items-center justify-center text-white text-lg shadow-soft group-hover:scale-105 transition-transform">
        🐾
      </div>
      <div className="leading-tight">
        <div className="text-lg">팰몬 허브</div>
        <div className="text-[10px] text-fg-subtle -mt-1">Palmon Survival Wiki</div>
      </div>
    </Link>
  );
}
