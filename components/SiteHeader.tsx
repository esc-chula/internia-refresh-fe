import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e7e5e4] bg-[#fafaf9]/90 backdrop-blur">
      <div className="mx-auto flex w-[min(100%-24px,1120px)] items-center justify-between py-3">
        <Link href="/" className="text-[1.15rem] font-extrabold tracking-[-0.03em] text-[#111111] no-underline">
          Internia
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/linemanwongnai">Companies</NavLink>
          <NavLink href="/company/line-man-wongnai/create">Write a review</NavLink>
        </nav>

        <div className="inline-flex items-center rounded-full border border-[#d6d3d1] bg-white px-3 py-1.5 text-[0.82rem] font-medium text-[#57534e]">
          Prototype
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center rounded-full px-4 text-[0.92rem] font-medium text-[#57534e] no-underline transition hover:bg-white hover:text-[#111111]"
    >
      {children}
    </Link>
  );
}
