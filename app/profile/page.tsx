"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CardSkeleton } from "@/components/CardSkeleton";
import { CustomSelect } from "@/components/CustomSelect";
import { useToast } from "@/components/Notifications";
import { ReviewCard } from "@/components/ReviewCard";
import { getCompany } from "@/lib/api/companies";
import { getMe, logout, updateProfile } from "@/lib/api/auth";
import { listLikedReviews, listMyReviews } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/types";
import type { Company, Review, User } from "@/lib/api/types";
import { clearSession } from "@/lib/auth-storage";
import { departments } from "@/lib/departments";

const departmentOptions = departments.map((department) => ({ value: department, label: department }));

export default function ProfilePage() {
  const router = useRouter();
  const showToast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likedReviews, setLikedReviews] = useState<Review[]>([]);
  const [companiesBySlug, setCompaniesBySlug] = useState<Record<string, Company>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getMe(), listMyReviews(), listLikedReviews()])
      .then(async ([fetchedUser, reviewsRes, likedRes]) => {
        if (cancelled) return;
        setUser(fetchedUser);
        setUsername(fetchedUser.username ?? "");
        setDepartment(fetchedUser.department ?? "");
        setReviews(reviewsRes.reviews);
        setLikedReviews(likedRes.reviews);

        const slugs = Array.from(
          new Set([...reviewsRes.reviews, ...likedRes.reviews].map((review) => review.companySlug)),
        );
        const companies = await Promise.all(
          slugs.map((slug) => getCompany(slug).catch(() => null)),
        );
        if (cancelled) return;
        const bySlug: Record<string, Company> = {};
        for (const company of companies) {
          if (company) bySlug[company.slug] = company;
        }
        setCompaniesBySlug(bySlug);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setUsernameError(null);

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้");
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile({ username: username.trim(), department });
      setUser(updated);
      showToast("บันทึกข้อมูลเรียบร้อยแล้ว");
    } catch (err) {
      if (err instanceof ApiError && err.fields?.username) {
        setUsernameError("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
      } else {
        showToast("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  function handleLikeChange(review: Review, liked: boolean, likeCount: number) {
    const patch = (list: Review[]) => list.map((r) => (r.id === review.id ? { ...r, likedByMe: liked, likeCount } : r));

    setReviews(patch);
    setLikedReviews((current) => {
      const patched = patch(current);
      if (!liked) return patched.filter((r) => r.id !== review.id);
      if (patched.some((r) => r.id === review.id)) return patched;
      return [{ ...review, likedByMe: liked, likeCount }, ...patched];
    });
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {}
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

  if (loading) {
    return (
      <main className="mx-auto w-[min(100%-40px,760px)] pt-5 pb-12 md:pt-8 md:pb-16">
        <div className="grid gap-8">
          <div className="animate-pulse rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
            <div className="grid gap-4">
              <div className="h-7 w-32 rounded bg-zinc-200" />
              <div className="h-11 rounded-full bg-zinc-100" />
              <div className="h-11 rounded-full bg-zinc-100" />
              <div className="h-11 rounded-full bg-zinc-100" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
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
                <ReviewCard
                  key={review.id}
                  review={review}
                  company={companiesBySlug[review.companySlug]}
                  showOwnerActions
                  onDeleted={(deletedId) => setReviews((current) => current.filter((r) => r.id !== deletedId))}
                  onLikeChange={handleLikeChange}
                />
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4">
          <h2 className="m-0 text-xl font-extrabold tracking-[-0.01em] text-zinc-900">รีวิวที่ถูกใจ ({likedReviews.length})</h2>

          {likedReviews.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
              คุณยังไม่ได้กดถูกใจรีวิวใดเลย
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {likedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  company={companiesBySlug[review.companySlug]}
                  showOwnerActions
                  onDeleted={(deletedId) => setLikedReviews((current) => current.filter((r) => r.id !== deletedId))}
                  onLikeChange={handleLikeChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
