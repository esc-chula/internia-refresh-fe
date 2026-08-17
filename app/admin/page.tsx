"use client";

import { useEffect, useMemo, useState } from "react";
import { CustomSelect } from "@/components/CustomSelect";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useConfirm, useToast } from "@/components/Notifications";
import { listAdminReviews, listAdminUsers, updateUserRole } from "@/lib/api/admin";
import { createCompany, deleteCompany, listCompanies, updateCompany } from "@/lib/api/companies";
import { deleteReview } from "@/lib/api/reviews";
import { companyTypes } from "@/lib/company-types";
import { intaniaBatch } from "@/lib/intania";
import type { AdminReview, Company, Role, User } from "@/lib/api/types";
import { ApiError } from "@/lib/api/types";

const companyTypeOptions = companyTypes.map((option) => ({ value: option, label: option }));
const FETCH_ALL_LIMIT = 300;

type Tab = "companies" | "users" | "reviews";

type CompanyFormState = { name: string; category: string; logo: File | null };

const emptyForm: CompanyFormState = { name: "", category: "", logo: null };

function groupCounts(labels: (string | null)[]): { label: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const raw of labels) {
    const label = raw ?? "ไม่ทราบ";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownCard({ title, items }: { title: string; items: { label: string; count: number }[] }) {
  const max = items.reduce((m, item) => Math.max(m, item.count), 0);
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4">
      <div className="mb-3 text-sm font-semibold text-zinc-900">{title}</div>
      {items.length === 0 ? (
        <p className="m-0 text-sm text-zinc-400">ไม่มีข้อมูล</p>
      ) : (
        <div className="grid gap-2">
          {items.map((item) => (
            <div key={item.label} className="grid gap-1">
              <div className="flex items-center justify-between text-xs text-zinc-600">
                <span className="truncate">{item.label}</span>
                <span className="shrink-0 font-semibold text-zinc-900">{item.count}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-zinc-900"
                  style={{ width: `${max > 0 ? (item.count / max) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const showToast = useToast();
  const confirm = useConfirm();

  const [tab, setTab] = useState<Tab>("companies");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<CompanyFormState>(emptyForm);
  const editLogoPreview = useMemo(() => (editForm.logo ? URL.createObjectURL(editForm.logo) : null), [editForm.logo]);

  useEffect(() => {
    return () => {
      if (editLogoPreview) URL.revokeObjectURL(editLogoPreview);
    };
  }, [editLogoPreview]);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<CompanyFormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [busyReviewId, setBusyReviewId] = useState<string | null>(null);

  async function loadAll() {
    setLoading(true);
    setLoadError(false);
    try {
      const [companiesRes, usersRes, reviewsRes] = await Promise.all([
        listCompanies({ limit: FETCH_ALL_LIMIT }),
        listAdminUsers(1, FETCH_ALL_LIMIT),
        listAdminReviews(1, FETCH_ALL_LIMIT),
      ]);
      setCompanies(companiesRes.companies);
      setUsers(usersRes.users);
      setReviews(reviewsRes.reviews);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const stats = useMemo(
    () => ({
      companies: companies.length,
      reviews: companies.reduce((sum, c) => sum + c.reviewCount, 0),
      users: users.length,
      admins: users.filter((u) => u.role === "admin").length,
    }),
    [companies, users],
  );

  const usersByBatch = useMemo(() => groupCounts(users.map((u) => intaniaBatch(u.email))), [users]);
  const usersByDepartment = useMemo(() => groupCounts(users.map((u) => u.department)), [users]);
  const reviewsByBatch = useMemo(() => groupCounts(reviews.map((r) => intaniaBatch(r.reviewerEmail ?? ""))), [reviews]);
  const reviewsByDepartment = useMemo(() => groupCounts(reviews.map((r) => r.reviewer.department)), [reviews]);

  function startEdit(company: Company) {
    setCreating(false);
    setEditingSlug(company.slug);
    setEditForm({ name: company.name, category: company.category, logo: null });
  }

  function cancelEdit() {
    setEditingSlug(null);
    setEditForm(emptyForm);
  }

  async function saveEdit(company: Company) {
    if (!editForm.name.trim() || !editForm.category) {
      showToast("กรุณากรอกชื่อและประเภทบริษัท", "error");
      return;
    }
    setSaving(true);
    try {
      const updated = await updateCompany(company.slug, {
        name: editForm.name.trim(),
        category: editForm.category,
        logo: editForm.logo,
      });
      setCompanies((current) => current.map((c) => (c.slug === company.slug ? updated : c)));
      showToast("บันทึกข้อมูลบริษัทแล้ว");
      cancelEdit();
    } catch (err) {
      if (err instanceof ApiError && err.fields?.name) {
        showToast("มีบริษัทชื่อนี้อยู่แล้ว", "error");
      } else {
        showToast("บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  function startCreate() {
    setEditingSlug(null);
    setCreating(true);
    setCreateForm(emptyForm);
  }

  function cancelCreate() {
    setCreating(false);
    setCreateForm(emptyForm);
  }

  async function saveCreate() {
    if (!createForm.name.trim() || !createForm.category) {
      showToast("กรุณากรอกชื่อและประเภทบริษัท", "error");
      return;
    }
    setSaving(true);
    try {
      const created = await createCompany({
        name: createForm.name.trim(),
        category: createForm.category,
        logo: createForm.logo,
      });
      setCompanies((current) => [created, ...current]);
      showToast("เพิ่มบริษัทแล้ว");
      cancelCreate();
    } catch (err) {
      if (err instanceof ApiError && err.fields?.name) {
        showToast("มีบริษัทชื่อนี้อยู่แล้ว", "error");
      } else {
        showToast("เพิ่มบริษัทไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCompany(company: Company) {
    const ok = await confirm(`ลบบริษัท "${company.name}" ใช่หรือไม่? รีวิวที่มีอยู่จะไม่ถูกลบตาม`, {
      confirmLabel: "ลบบริษัท",
    });
    if (!ok) return;
    try {
      await deleteCompany(company.slug);
      setCompanies((current) => current.filter((c) => c.slug !== company.slug));
      showToast("ลบบริษัทแล้ว");
    } catch {
      showToast("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    }
  }

  async function handleToggleRole(user: User) {
    const nextRole: Role = user.role === "admin" ? "user" : "admin";
    const ok = await confirm(
      nextRole === "admin"
        ? `ให้สิทธิ์แอดมินแก่ ${user.username ?? user.email} ใช่หรือไม่?`
        : `ยกเลิกสิทธิ์แอดมินของ ${user.username ?? user.email} ใช่หรือไม่?`,
      { confirmLabel: "ยืนยัน" },
    );
    if (!ok) return;

    setBusyUserId(user.id);
    try {
      const updated = await updateUserRole(user.id, nextRole);
      setUsers((current) => current.map((u) => (u.id === user.id ? updated : u)));
      showToast("อัปเดตสิทธิ์ผู้ใช้แล้ว");
    } catch (err) {
      if (err instanceof ApiError) {
        showToast(err.message || "อัปเดตสิทธิ์ไม่สำเร็จ", "error");
      } else {
        showToast("อัปเดตสิทธิ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
      }
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleDeleteReview(review: AdminReview) {
    const ok = await confirm(`ลบรีวิวตำแหน่ง "${review.position}" ที่ ${review.companyName} ใช่หรือไม่?`, {
      confirmLabel: "ลบรีวิว",
    });
    if (!ok) return;

    setBusyReviewId(review.id);
    try {
      await deleteReview(review.id);
      setReviews((current) => current.filter((r) => r.id !== review.id));
      showToast("ลบรีวิวแล้ว");
    } catch {
      showToast("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setBusyReviewId(null);
    }
  }

  if (loadError) {
    return (
      <main className="mx-auto w-[min(100%-40px,960px)] py-12 text-center">
        <p className="text-sm text-red-600">โหลดข้อมูลไม่สำเร็จ กรุณาลองรีเฟรชหน้าใหม่</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-16 md:pt-8">
      <div className="grid gap-6">
        <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-zinc-900">แดชบอร์ดแอดมิน</h1>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["บริษัท", stats.companies],
            ["รีวิว", stats.reviews],
            ["ผู้ใช้", stats.users],
            ["แอดมิน", stats.admins],
          ].map(([label, value]) => (
            <div key={label as string} className="rounded-2xl border border-zinc-200 bg-white p-4">
              <div className="text-2xl font-extrabold text-zinc-900">{loading ? "-" : value}</div>
              <div className="text-sm text-zinc-500">{label}</div>
            </div>
          ))}
        </div>

        {!loading && (
          <div className="grid gap-3 sm:grid-cols-2">
            <BreakdownCard title="ผู้ใช้ตามรุ่น" items={usersByBatch} />
            <BreakdownCard title="ผู้ใช้ตามภาควิชา" items={usersByDepartment} />
            <BreakdownCard title="รีวิวตามรุ่น" items={reviewsByBatch} />
            <BreakdownCard title="รีวิวตามภาควิชา" items={reviewsByDepartment} />
          </div>
        )}

        <div className="flex gap-2 border-b border-zinc-200">
          <button
            type="button"
            onClick={() => setTab("companies")}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === "companies" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
          >
            จัดการบริษัท
          </button>
          <button
            type="button"
            onClick={() => setTab("reviews")}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === "reviews" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
          >
            จัดการรีวิว
          </button>
          <button
            type="button"
            onClick={() => setTab("users")}
            className={`px-4 py-2.5 text-sm font-semibold ${tab === "users" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500"}`}
          >
            จัดการผู้ใช้
          </button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : tab === "companies" ? (
          <div className="grid gap-3">
            {!creating && (
              <button
                type="button"
                onClick={startCreate}
                className="h-10 justify-self-start rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-zinc-800"
              >
                + เพิ่มบริษัท
              </button>
            )}

            {creating && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium text-zinc-700">ชื่อบริษัท</span>
                      <input
                        value={createForm.name}
                        onChange={(event) => setCreateForm((f) => ({ ...f, name: event.target.value }))}
                        className="h-10 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="text-sm font-medium text-zinc-700">ประเภท</span>
                      <CustomSelect
                        value={createForm.category}
                        onChange={(value) => setCreateForm((f) => ({ ...f, category: value }))}
                        options={companyTypeOptions}
                        placeholder="เลือกประเภท"
                      />
                    </label>
                  </div>
                  <label className="grid gap-1.5">
                    <span className="text-sm font-medium text-zinc-700">โลโก้ (ไม่บังคับ)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setCreateForm((f) => ({ ...f, logo: event.target.files?.[0] ?? null }))}
                      className="text-sm text-zinc-600"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={saveCreate}
                      disabled={saving}
                      className="h-9 rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
                    >
                      {saving ? "กำลังบันทึก..." : "เพิ่มบริษัท"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelCreate}
                      className="h-9 rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-700"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {companies.map((company) => (
              <div key={company.slug} className="rounded-2xl border border-zinc-200 bg-white p-4">
                {editingSlug === company.slug ? (
                  <div className="grid gap-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="grid gap-1.5">
                        <span className="text-sm font-medium text-zinc-700">ชื่อบริษัท</span>
                        <input
                          value={editForm.name}
                          onChange={(event) => setEditForm((f) => ({ ...f, name: event.target.value }))}
                          className="h-10 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none focus:border-zinc-400"
                        />
                      </label>
                      <label className="grid gap-1.5">
                        <span className="text-sm font-medium text-zinc-700">ประเภท</span>
                        <CustomSelect
                          value={editForm.category}
                          onChange={(value) => setEditForm((f) => ({ ...f, category: value }))}
                          options={companyTypeOptions}
                          placeholder="เลือกประเภท"
                        />
                      </label>
                    </div>
                    <label className="grid gap-2">
                      <span className="text-sm font-medium text-zinc-700">โลโก้</span>
                      <div className="flex items-center gap-3">
                        <CompanyLogo logoUrl={editLogoPreview ?? company.logoUrl} alt={company.name} size={48} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => setEditForm((f) => ({ ...f, logo: event.target.files?.[0] ?? null }))}
                          className="text-sm text-zinc-600"
                        />
                      </div>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(company)}
                        disabled={saving}
                        className="h-9 rounded-full bg-zinc-900 px-4 text-sm font-semibold text-white disabled:opacity-60"
                      >
                        {saving ? "กำลังบันทึก..." : "บันทึก"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="h-9 rounded-full border border-zinc-300 px-4 text-sm font-semibold text-zinc-700"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CompanyLogo logoUrl={company.logoUrl} alt={company.name} size={44} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold text-zinc-900">{company.name}</div>
                      <div className="text-sm text-zinc-500">
                        {company.category} · {company.reviewCount} รีวิว
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => startEdit(company)}
                      className="h-9 shrink-0 rounded-full border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCompany(company)}
                      className="h-9 shrink-0 rounded-full border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      ลบ
                    </button>
                  </div>
                )}
              </div>
            ))}

            {companies.length === 0 && !creating && (
              <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
                ยังไม่มีบริษัทในระบบ
              </p>
            )}
          </div>
        ) : tab === "reviews" ? (
          <div className="grid gap-3">
            {reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-zinc-900">
                      {review.companyName} · {review.position}
                    </div>
                    <div className="truncate text-sm text-zinc-500">
                      {review.reviewerEmail ?? "ไม่ทราบผู้เขียน"} {review.reviewer.department ? `· ${review.reviewer.department}` : ""}
                      {review.anonymous && <span className="ml-1 text-zinc-400">(ไม่ระบุตัวตนต่อสาธารณะ)</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteReview(review)}
                    disabled={busyReviewId === review.id}
                    className="h-9 shrink-0 rounded-full border border-red-200 px-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                  >
                    ลบ
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span>{review.startDate} – {review.endDate}</span>
                  <span>· {review.workMode}</span>
                  <span>
                    · คะแนนรวม {review.overallScore} (งาน {review.workScore} / สังคม {review.socialScore} / พี่เลี้ยง{" "}
                    {review.mentorScore} / ประสบการณ์ {review.experienceScore})
                  </span>
                </div>

                <div className="mt-3 grid gap-2.5">
                  {[
                    ["ขั้นตอนการสมัคร/สัมภาษณ์", review.applicationSection],
                    ["งานที่ได้รับมอบหมาย", review.workSection],
                    ["บรรยากาศการทำงาน", review.atmosphereSection],
                    ["สวัสดิการ/การเดินทาง", review.welfareSection],
                    ["คำแนะนำ", review.adviceSection],
                  ]
                    .filter(([, text]) => text)
                    .map(([label, text]) => (
                      <div key={label} className="rounded-xl bg-zinc-50 p-3">
                        <div className="mb-1 text-xs font-semibold text-zinc-500">{label}</div>
                        <p className="m-0 whitespace-pre-wrap text-sm text-zinc-700">{text}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}

            {reviews.length === 0 && (
              <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
                ยังไม่มีรีวิวในระบบ
              </p>
            )}
          </div>
        ) : (
          <div className="grid gap-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-zinc-900">{user.username ?? "(ยังไม่ตั้งชื่อผู้ใช้)"}</div>
                  <div className="truncate text-sm text-zinc-500">
                    {user.email} {user.department ? `· ${user.department}` : ""}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    user.role === "admin" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {user.role === "admin" ? "แอดมิน" : "ผู้ใช้ทั่วไป"}
                </span>
                <button
                  type="button"
                  onClick={() => handleToggleRole(user)}
                  disabled={busyUserId === user.id}
                  className="h-9 shrink-0 rounded-full border border-zinc-300 px-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400 disabled:opacity-60"
                >
                  {user.role === "admin" ? "ถอดสิทธิ์" : "ตั้งเป็นแอดมิน"}
                </button>
              </div>
            ))}

            {users.length === 0 && (
              <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
                ยังไม่มีผู้ใช้ในระบบ
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
