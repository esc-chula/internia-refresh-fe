"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/CustomSelect";
import { ReviewCard } from "@/components/ReviewCard";
import { getMe, logout, updateProfile } from "@/lib/api/auth";
import { listMyReviews } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/types";
import type { Review, User } from "@/lib/api/types";
import { clearSession } from "@/lib/auth-storage";
import { departments } from "@/lib/departments";

const departmentOptions = departments.map((department) => ({ value: department, label: department }));

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadError, setLoadError] = useState(false);

  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMe(), listMyReviews()])
      .then(([fetchedUser, reviewsRes]) => {
        if (cancelled) return;
        setUser(fetchedUser);
        setUsername(fetchedUser.username ?? "");
        setDepartment(fetchedUser.department ?? "");
        setReviews(reviewsRes.reviews);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setUsernameError(null);
    setSaveError(null);
    setSaved(false);

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({ username: username.trim(), department });
      setUser(updated);
      setSaved(true);
    } catch (err) {
      if (err instanceof ApiError && err.fields?.username) {
        setUsernameError("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
      } else {
        setSaveError("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // stateless tokens — logging out client-side still works even if
      // this call fails (e.g. network issue).
    }
    clearSession();
    router.replace("/login");
  }

  if (loadError) {
    return (
      <main className="mx-auto w-[min(100%-40px,760px)] py-12 text-center">
        <p className="text-sm text-internia-primary">โหลดข้อมูลไม่สำเร็จ กรุณาลองรีเฟรชหน้าใหม่</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(100%-40px,760px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-8">
        <section className="grid gap-5 rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
          <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-zinc-900">โปรไฟล์</h1>

          {user && (
            <form onSubmit={handleSave} className="grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-zinc-700">อีเมล</span>
                <div className="h-11 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm leading-[44px] text-zinc-500">
                  {user.email}
                </div>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-zinc-700">ชื่อผู้ใช้</span>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  maxLength={32}
                  className="h-11 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10"
                />
                {usernameError && <span className="text-sm text-internia-primary">{usernameError}</span>}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-zinc-700">ภาควิชา</span>
                <CustomSelect value={department} onChange={setDepartment} placeholder="เลือกภาควิชา" options={departmentOptions} />
              </label>

              {saveError && <p className="m-0 text-sm text-internia-primary">{saveError}</p>}
              {saved && <p className="m-0 text-sm text-green-600">บันทึกข้อมูลเรียบร้อย</p>}

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400"
                >
                  ออกจากระบบ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark disabled:opacity-60"
                >
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="grid gap-4">
          <h2 className="m-0 text-xl font-extrabold tracking-[-0.01em] text-zinc-900">รีวิวของฉัน ({reviews.length})</h2>

          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
              คุณยังไม่ได้เขียนรีวิว
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
