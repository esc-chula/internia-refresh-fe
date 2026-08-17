"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getMe } from "@/lib/api/auth";
import { getAccessToken, getIsAdmin, setIsAdminCookie } from "@/lib/auth-storage";

export function SiteHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsAdmin(getIsAdmin());
  }, [pathname]);

  useEffect(() => {
    if (!getAccessToken()) return;
    getMe()
      .then((user) => {
        const admin = user.role === "admin";
        setIsAdminCookie(admin);
        setIsAdmin(admin);
      })
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950">
      <div className="mx-auto flex h-16 w-[min(100%-40px,1120px)] items-center justify-between gap-2">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-base font-bold tracking-[-0.02em] text-white no-underline sm:gap-3 sm:text-[1.15rem]"
        >
          <Image src="/esc.png" alt="ESC" width={28} height={28} className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7" />
          <span className="hidden h-5 w-px bg-white/20 sm:block" aria-hidden="true" />
          Internia
        </Link>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-white no-underline transition hover:bg-white/10 sm:px-3"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                <path d="M12 2l8 4v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-4z" />
              </svg>
              <span className="hidden sm:inline">แอดมิน</span>
            </Link>
          )}

          <Link
            href="/profile"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-white no-underline transition hover:bg-white/10 sm:px-3"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" />
            </svg>
            <span className="hidden sm:inline">โปรไฟล์</span>
          </Link>

          <Link
            href="/create"
            className="inline-flex h-9 shrink-0 items-center whitespace-nowrap rounded-full bg-white px-3 text-sm font-semibold text-black no-underline shadow-crisp transition active:scale-95 hover:bg-white/90 sm:px-4"
          >
            เขียนรีวิว
          </Link>
        </div>
      </div>
    </header>
  );
}
