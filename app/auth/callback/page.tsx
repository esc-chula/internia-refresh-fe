"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import { setSession } from "@/lib/auth-storage";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");

    if (!accessToken || !refreshToken) {
      setError(true);
      return;
    }

    setSession(accessToken, refreshToken, false);

    getMe()
      .then((user) => {
        setSession(accessToken, refreshToken, user.onboarded);
        router.replace(user.onboarded ? "/" : "/onboarding");
      })
      .catch(() => setError(true));
  }, [router]);

  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] w-[min(100%-40px,420px)] place-items-center">
      <div className="grid justify-items-center gap-3 text-center">
        {error ? (
          <>
            <p className="m-0 text-sm text-internia-primary">เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง</p>
            <a href="/login" className="text-sm font-semibold text-internia-primary no-underline hover:text-internia-primaryDark">
              กลับไปหน้าเข้าสู่ระบบ
            </a>
          </>
        ) : (
          <p className="m-0 text-sm text-zinc-500">กำลังเข้าสู่ระบบ...</p>
        )}
      </div>
    </main>
  );
}
