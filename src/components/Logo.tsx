import Link from "next/link";

const LOGO_URL =
  "https://lilithimage.lilithcdn.com/allgames-official-web/ptslg/en/imgaes/pc/logo.webp";

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={LOGO_URL}
        alt="Palmon Survival"
        className="h-9 w-auto object-contain group-hover:scale-105 transition-transform"
      />
      <div className="leading-tight">
        <div className="text-lg">팰몬 허브</div>
        <div className="text-[10px] text-fg-subtle -mt-1">
          Palmon Survival Wiki
        </div>
      </div>
    </Link>
  );
}
