"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import { CustomSelect } from "./CustomSelect";
import { MultiSelect } from "./MultiSelect";
import { SearchBox } from "./SearchBox";
import { ReviewCard } from "./ReviewCard";
import type { Review } from "@/lib/api/types";

type Sort = "newest" | "experience";
type Direction = "asc" | "desc";

const sortOptions = [
  { value: "newest", label: "เรียงตาม: วันที่" },
  { value: "experience", label: "เรียงตาม: คะแนนประสบการณ์" },
];

const yearFilterOptions = [
  { value: "1", label: "ปี 1" },
  { value: "2", label: "ปี 2" },
  { value: "3", label: "ปี 3" },
  { value: "4", label: "ปี 4" },
];

const gpaFilterOptions = [
  { value: "2.00", label: "เกรดเฉลี่ย 2.00 ขึ้นไป" },
  { value: "2.25", label: "เกรดเฉลี่ย 2.25 ขึ้นไป" },
  { value: "2.50", label: "เกรดเฉลี่ย 2.50 ขึ้นไป" },
  { value: "2.75", label: "เกรดเฉลี่ย 2.75 ขึ้นไป" },
  { value: "3.00", label: "เกรดเฉลี่ย 3.00 ขึ้นไป" },
];

function matchesYearFilter(review: Review, years: string[]) {
  if (years.length === 0) return true;
  if (review.hasYearLimit !== true) return true;
  const accepted = review.acceptedYears ?? [];
  return years.some((year) => accepted.includes(Number(year)));
}

function matchesMinGpaFilter(review: Review, gpas: string[]) {
  if (gpas.length === 0) return true;
  if (review.hasMinGpa !== true || review.minGpa == null) return true;
  return gpas.some((gpa) => review.minGpa! <= Number(gpa));
}

export function CompanyReviewsExplore({ reviews }: { reviews: Review[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("position") ?? "");
  const [draft, setDraft] = useState(searchParams.get("position") ?? "");
  const [department, setDepartment] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string[]>([]);
  const [gpaFilter, setGpaFilter] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("newest");
  const [direction, setDirection] = useState<Direction>("desc");

  const departmentOptions = useMemo(() => {
    const unique = Array.from(
      new Set(reviews.map((review) => review.reviewer.department).filter((value): value is string => Boolean(value))),
    ).sort();
    return unique.map((option) => ({ value: option, label: option }));
  }, [reviews]);

  const dir = direction === "desc" ? 1 : -1;

  const searchIndex = useMemo(() => new Fuse(reviews, { keys: ["position"], threshold: 0.35 }), [reviews]);

  const hasActiveFilters = department.length > 0 || yearFilter.length > 0 || gpaFilter.length > 0;

  function clearFilters() {
    setDepartment([]);
    setYearFilter([]);
    setGpaFilter([]);
  }

  const filtered = useMemo(() => {
    const q = query.trim();
    const base = q ? searchIndex.search(q).map((result) => result.item) : reviews;
    const list = base.filter((review) => {
      if (department.length > 0 && (!review.reviewer.department || !department.includes(review.reviewer.department))) return false;
      if (!matchesYearFilter(review, yearFilter)) return false;
      if (!matchesMinGpaFilter(review, gpaFilter)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "newest") return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) * dir;
      return (b.experienceScore - a.experienceScore) * dir;
    });
  }, [reviews, searchIndex, query, department, yearFilter, gpaFilter, sort, dir]);

  return (
    <section className="grid grid-cols-1 gap-3.5">
      <div className="grid grid-cols-1 gap-2.5">
        <SearchBox compact value={draft} onChange={setDraft} onSubmit={() => setQuery(draft)} placeholder="ค้นหาตำแหน่งฝึกงาน" />

        <div className="flex flex-wrap items-center gap-2.5">
          <CustomSelect value={sort} onChange={(value) => setSort(value as Sort)} options={sortOptions} />

          <button
            type="button"
            onClick={() => setDirection((value) => (value === "desc" ? "asc" : "desc"))}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 transition active:scale-[0.96] hover:border-zinc-400"
            title={direction === "desc" ? "มากไปน้อย" : "น้อยไปมาก"}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {direction === "desc" ? <path d="M12 5v14m0 0-5-5m5 5 5-5" /> : <path d="M12 19V5m0 0-5 5m5-5 5 5" />}
            </svg>
            {direction === "desc" ? "มาก-น้อย" : "น้อย-มาก"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <MultiSelect values={department} onChange={setDepartment} options={departmentOptions} placeholder="ทุกภาควิชา" />
          <MultiSelect values={yearFilter} onChange={setYearFilter} options={yearFilterOptions} placeholder="ชั้นปีที่เปิดรับ" />
          <MultiSelect values={gpaFilter} onChange={setGpaFilter} options={gpaFilterOptions} placeholder="เกรดเฉลี่ยขั้นต่ำ" />

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-internia-primary transition hover:text-internia-primaryDark"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              ล้างตัวกรอง
            </button>
          )}
        </div>
      </div>

      {filtered.map((review, index) => (
        <div key={review.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
          <ReviewCard review={review} />
        </div>
      ))}

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
          ไม่พบรีวิวที่ตรงกับเงื่อนไขที่เลือก
        </p>
      )}
    </section>
  );
}
