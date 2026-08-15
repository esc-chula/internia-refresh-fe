"use client";

import { useSearchParams } from "next/navigation";
import { googleLoginUrl } from "@/lib/api/auth";

const errorMessages: Record<string, string> = {
  EMAIL_DOMAIN_NOT_ALLOWED: "รองรับเฉพาะอีเมลนิสิตจุฬาฯ (@student.chula.ac.th) เท่านั้น",
  INVALID_GOOGLE_TOKEN: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
  INVALID_STATE: "เซสชันเข้าสู่ระบบหมดอายุ กรุณาลองใหม่อีกครั้ง",
  MISSING_CODE: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
  LOGIN_FAILED: "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] w-[min(100%-40px,420px)] place-items-center">
      <div className="grid w-full justify-items-center gap-6 rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-lift">
        <div className="grid gap-2">
          <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-zinc-900">เข้าสู่ระบบ Internia</h1>
          <p className="m-0 text-sm text-zinc-500">ใช้บัญชี Google นิสิตจุฬาฯ (@student.chula.ac.th)</p>
        </div>

        <a
          href={googleLoginUrl()}
          className="inline-flex h-11 items-center gap-2.5 rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 no-underline shadow-crisp transition hover:border-zinc-400 hover:bg-zinc-50"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33A9 9 0 0 0 9 18z" />
            <path fill="#FBBC05" d="M3.95 10.71A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.33z" />
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z" />
          </svg>
          เข้าสู่ระบบด้วย Google
        </a>

        {errorCode && <p className="m-0 text-sm text-internia-primary">{errorMessages[errorCode] ?? errorMessages.LOGIN_FAILED}</p>}
      </div>
    </main>
  );
}
