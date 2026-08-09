"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomSelect } from "./CustomSelect";
import { ReviewCard } from "./ReviewCard";
import { Review } from "@/lib/mock-data";

type Sort = "newest" | "experience";
type Direction = "asc" | "desc";

const sortOptions = [
  { value: "newest", label: "เรียงตาม: วันที่" },
  { value: "experience", label: "เรียงตาม: คะแนนประสบการณ์" },
];

const yearFilterOptions = [
  { value: "all", label: "ชั้นปีที่เปิดรับ" },
  { value: "1", label: "ปี 1" },
  { value: "2", label: "ปี 2" },
  { value: "3", label: "ปี 3" },
  { value: "4", label: "ปี 4" },
];

const gpaFilterOptions = [
  { value: "all", label: "เกรดเฉลี่ยขั้นต่ำ" },
  { value: "2.00", label: "เกรดเฉลี่ย 2.00 ขึ้นไป" },
  { value: "2.25", label: "เกรดเฉลี่ย 2.25 ขึ้นไป" },
  { value: "2.50", label: "เกรดเฉลี่ย 2.50 ขึ้นไป" },
  { value: "2.75", label: "เกรดเฉลี่ย 2.75 ขึ้นไป" },
  { value: "3.00", label: "เกรดเฉลี่ย 3.00 ขึ้นไป" },
];

function matchesOpenYear(openYears: string, year: string) {
  if (year === "all") return true;
  if (openYears === "ทุกชั้นปี") return true;
  const nums = (openYears.match(/\d+/g) ?? []).map(Number);
  if (nums.length === 0) return false;
  const target = Number(year);
  return target >= Math.min(...nums) && target <= Math.max(...nums);
}

function matchesMinGpa(minGpa: number | null, gpa: string) {
  if (gpa === "all") return true;
  if (minGpa == null) return true;
  return minGpa <= Number(gpa);
}

export function CompanyReviewsExplore({ reviews }: { reviews: Review[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("position") ?? "");
  const [department, setDepartment] = useState("all");
  const [intania, setIntania] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [gpaFilter, setGpaFilter] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");
  const [direction, setDirection] = useState<Direction>("desc");

  const departmentOptions = useMemo(() => {
    const unique = Array.from(new Set(reviews.map((review) => review.department))).sort();
    return [{ value: "all", label: "ทุกภาควิชา" }, ...unique.map((option) => ({ value: option, label: option }))];
  }, [reviews]);

  const intaniaOptions = useMemo(() => {
    const unique = Array.from(new Set(reviews.map((review) => review.intania))).sort();
    return [{ value: "all", label: "ทุกรุ่น" }, ...unique.map((option) => ({ value: option, label: `รุ่น ${option}` }))];
  }, [reviews]);

  const dir = direction === "desc" ? 1 : -1;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = reviews.filter((review) => {
      if (department !== "all" && review.department !== department) return false;
      if (intania !== "all" && review.intania !== intania) return false;
      if (!matchesOpenYear(review.openYears, yearFilter)) return false;
      if (!matchesMinGpa(review.minGpa, gpaFilter)) return false;
      if (q && !review.position.toLowerCase().includes(q)) return false;
      return true;
    });

    return [...list].sort((a, b) => {
      if (sort === "newest") return (b.daysAgo - a.daysAgo) * -dir;
      return (b.scores.experience - a.scores.experience) * dir;
    });
  }, [reviews, query, department, intania, yearFilter, gpaFilter, sort, dir]);

  return (
    <section className="grid gap-3.5">
      <div className="flex flex-wrap items-center gap-2.5">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ค้นหาตำแหน่งฝึกงาน"
          className="h-10 min-w-[180px] flex-1 rounded-full border border-zinc-300 bg-white px-4 text-[0.86rem] text-zinc-700 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10 sm:flex-none"
        />
        <CustomSelect value={department} onChange={setDepartment} options={departmentOptions} />
        <CustomSelect value={intania} onChange={setIntania} options={intaniaOptions} />
        <CustomSelect value={yearFilter} onChange={setYearFilter} options={yearFilterOptions} />
        <CustomSelect value={gpaFilter} onChange={setGpaFilter} options={gpaFilterOptions} />
        <CustomSelect value={sort} onChange={(value) => setSort(value as Sort)} options={sortOptions} />

        <button
          type="button"
          onClick={() => setDirection((value) => (value === "desc" ? "asc" : "desc"))}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 text-[0.86rem] text-zinc-700 transition hover:border-zinc-400"
          title={direction === "desc" ? "มากไปน้อย" : "น้อยไปมาก"}
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {direction === "desc" ? <path d="M12 5v14m0 0-5-5m5 5 5-5" /> : <path d="M12 19V5m0 0-5 5m5-5 5 5" />}
          </svg>
          {direction === "desc" ? "มาก-น้อย" : "น้อย-มาก"}
        </button>

      </div>

      {filtered.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-[0.92rem] text-zinc-400">
          ไม่พบรีวิวที่ตรงกับเงื่อนไขที่เลือก
        </p>
      )}
    </section>
  );
}
