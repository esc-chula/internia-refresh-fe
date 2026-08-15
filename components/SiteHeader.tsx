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

        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-white no-underline transition hover:bg-white/10"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
            </svg>
            โปรไฟล์
          </Link>

          <Link
            href="/create"
            className="inline-flex h-9 items-center rounded-full bg-white px-4 text-sm font-semibold text-black no-underline shadow-crisp transition active:scale-95 hover:bg-white/90"
          >
            เขียนรีวิว
          </Link>
        </div>
      </div>
    </header>
  );
}
