import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950">
      <div className="mx-auto flex h-16 w-[min(100%-40px,1120px)] items-center justify-between">
        <Link href="/" className="flex items-center gap-3 text-[1.15rem] font-bold tracking-[-0.02em] text-white no-underline">
          <Image src="/esc.png" alt="ESC" width={28} height={28} className="h-7 w-7 object-contain" />
          <span className="h-5 w-px bg-white/20" aria-hidden="true" />
          Internia
        </Link>

        <Link
          href="/create/line-man-wongnai"
          className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-black no-underline shadow-crisp transition active:scale-95 hover:bg-white/90"
        >
          เขียนรีวิว
        </Link>
      </div>
    </header>
  );
}
