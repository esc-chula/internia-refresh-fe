"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { HeroBackground } from "./HeroBackground";
import { CompanyCard } from "./CompanyCard";
import { CompanyLogo } from "./CompanyLogo";
import { ReviewCard } from "./ReviewCard";
import { CustomSelect } from "./CustomSelect";
import { companies, departments, intaniaBatches, reviews } from "@/lib/mock-data";

type Mode = "company" | "review";
type Direction = "asc" | "desc";
type CompanySort = "rating" | "reviews" | "recommend" | "name";
type ReviewSort = "newest" | "rating";

const PAGE_SIZE = 15;

const TAG_OPTIONS = [
  "Tech",
  "AI / Data",
  "FinTech",
  "Banking",
  "E-com",
  "Logistics",
  "Consulting",
  "Telecom",
  "Retail",
  "Travel",
  "Healthcare",
  "Manufacturing",
  "Energy",
  "Education",
  "Media",
  "Real Estate",
];

const companyById = new Map(companies.map((company) => [company.id, company]));

const tagSelectOptions = [
  { value: "all", label: "ประเภทบริษัท" },
  ...TAG_OPTIONS.map((option) => ({ value: option, label: option })),
];

const companySortOptions = [
  { value: "reviews", label: "เรียงตาม: รีวิวมากที่สุด" },
  { value: "rating", label: "เรียงตาม: คะแนนสูงสุด" },
  { value: "recommend", label: "เรียงตาม: แนะนำมากที่สุด" },
  { value: "name", label: "เรียงตาม: ชื่อ" },
];

const reviewSortOptions = [
  { value: "newest", label: "เรียงตาม: วันที่" },
  { value: "rating", label: "เรียงตาม: คะแนนบริษัท" },
];

const departmentSelectOptions = [
  { value: "all", label: "ทุกภาควิชา" },
  ...departments.map((option) => ({ value: option, label: option })),
];

const intaniaSelectOptions = [
  { value: "all", label: "ทุกรุ่น" },
  ...intaniaBatches.map((option) => ({ value: option, label: `รุ่น ${option}` })),
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

export function HomeExplore() {
  const [mode, setMode] = useState<Mode>("company");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState("all");
  const [department, setDepartment] = useState("all");
  const [intania, setIntania] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [gpaFilter, setGpaFilter] = useState("all");
  const [companySort, setCompanySort] = useState<CompanySort>("reviews");
  const [reviewSort, setReviewSort] = useState<ReviewSort>("newest");
  const [direction, setDirection] = useState<Direction>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewFocused, setPreviewFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dir = direction === "desc" ? 1 : -1;

  const previewResults = useMemo(() => {
    const q = draft.trim().toLowerCase();
    if (!q) return [];

    if (mode === "company") {
      return companies
        .filter((company) => company.name.toLowerCase().includes(q))
        .sort((a, b) => Number(!a.name.toLowerCase().startsWith(q)) - Number(!b.name.toLowerCase().startsWith(q)))
        .slice(0, 6)
        .map((company) => ({ company, matchedPosition: undefined as string | undefined }));
    }

    const seen = new Set<string>();
    const matches: { company: (typeof companies)[number]; matchedPosition?: string }[] = [];
    for (const review of reviews) {
      const company = companyById.get(review.companyId);
      if (!company) continue;
      const nameMatch = company.name.toLowerCase().includes(q);
      const positionMatch = review.position.toLowerCase().includes(q);
      if (!nameMatch && !positionMatch) continue;
      const key = `${company.id}-${positionMatch ? review.position : ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ company, matchedPosition: positionMatch ? review.position : undefined });
      if (matches.length >= 6) break;
    }
    return matches;
  }, [draft, mode]);

  const showPreview = previewFocused && previewResults.length > 0;

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = companies.filter((company) => {
      if (tag !== "all" && company.tag !== tag) return false;
      if (!q) return true;
      return company.name.toLowerCase().includes(q);
    });

    return [...list].sort((a, b) => {
      if (companySort === "rating") return (b.rating - a.rating) * dir;
      if (companySort === "reviews") return (b.reviewCount - a.reviewCount) * dir;
      if (companySort === "recommend") {
        return (b.recommendCount / b.reviewCount - a.recommendCount / a.reviewCount) * dir;
      }
      return a.name.localeCompare(b.name) * -dir;
    });
  }, [query, tag, companySort, dir]);

  const filteredReviews = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = reviews.filter((review) => {
      const company = companyById.get(review.companyId);
      if (!company) return false;
      if (tag !== "all" && company.tag !== tag) return false;
      if (department !== "all" && review.department !== department) return false;
      if (intania !== "all" && review.intania !== intania) return false;
      if (!matchesOpenYear(review.openYears, yearFilter)) return false;
      if (!matchesMinGpa(review.minGpa, gpaFilter)) return false;
      if (!q) return true;
      return company.name.toLowerCase().includes(q) || review.position.toLowerCase().includes(q);
    });

    return [...list].sort((a, b) => {
      if (reviewSort === "newest") return (b.daysAgo - a.daysAgo) * -dir;
      const ratingA = companyById.get(a.companyId)?.rating ?? 0;
      const ratingB = companyById.get(b.companyId)?.rating ?? 0;
      return (ratingB - ratingA) * dir;
    });
  }, [query, tag, department, intania, yearFilter, gpaFilter, reviewSort, dir]);

  const results = mode === "company" ? filteredCompanies : filteredReviews;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [mode, query, tag, department, intania, yearFilter, gpaFilter, companySort, reviewSort, direction]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((count) => Math.min(count + PAGE_SIZE, results.length));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [results.length]);

  return (
    <main>
      <section className="relative grid justify-items-center gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-14 text-center sm:px-6 md:gap-5 md:py-24">
        <HeroBackground />
        <h1 className="relative z-10 m-0 text-[clamp(1.9rem,7vw,3.6rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-zinc-900 md:leading-[1.05]">
          รีวิวฝึกงานที่จริงใจจาก<br className="sm:hidden" />ชาววิศวฯ จุฬาฯ
        </h1>
        <p className="relative z-10 m-0 max-w-[560px] text-md leading-relaxed text-zinc-500 md:text-[1.1rem]">
          ร่วมแชร์ประสบการณ์ฝึกงานของคุณ
        </p>

        <div className="relative z-20 w-[min(100%,640px)]">
          <form
            className="flex items-center gap-4 rounded-full border border-zinc-200 bg-white p-1.5 pl-2 shadow-lift sm:gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(draft);
              setPreviewFocused(false);
            }}
          >
            <div className="flex shrink-0 rounded-full bg-zinc-100 p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode("company")}
                className={`rounded-full px-3 py-1.5 transition ${mode === "company" ? "bg-white text-zinc-900 shadow-crisp" : "text-zinc-500"}`}
              >
                บริษัท
              </button>
              <button
                type="button"
                onClick={() => setMode("review")}
                className={`rounded-full px-3 py-1.5 transition ${mode === "review" ? "bg-white text-zinc-900 shadow-crisp" : "text-zinc-500"}`}
              >
                รีวิว
              </button>
            </div>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onFocus={() => {
                if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
                setPreviewFocused(true);
              }}
              onBlur={() => {
                blurTimeoutRef.current = setTimeout(() => setPreviewFocused(false), 120);
              }}
              className="h-10 min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 sm:h-11 sm:text-base"
              placeholder={mode === "company" ? "ค้นหาบริษัท" : "ค้นหาบริษัทหรือตำแหน่งฝึกงาน"}
            />
            <button
              type="submit"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-internia-primary text-white transition hover:bg-internia-primaryDark sm:h-11 sm:w-11"
              aria-label="ค้นหา"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>

          {showPreview && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] max-h-72 overflow-y-auto rounded-2xl border border-zinc-200 bg-white text-left shadow-lift">
              {previewResults.map(({ company, matchedPosition }, index) => (
                <Link
                  key={`${company.id}-${index}`}
                  href={
                    matchedPosition
                      ? `/company/${company.id}?position=${encodeURIComponent(matchedPosition)}`
                      : `/company/${company.id}`
                  }
                  className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 no-underline last:border-b-0 hover:bg-zinc-50"
                >
                  <CompanyLogo id={company.id} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-zinc-900">{company.name}</div>
                    <div className="truncate text-sm text-zinc-500">
                      {matchedPosition ? `ตำแหน่ง: ${matchedPosition}` : company.tag}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 flex w-full max-w-[1120px] flex-wrap items-center justify-center gap-2.5">
          <CustomSelect value={tag} onChange={setTag} options={tagSelectOptions} />

          {mode === "review" && (
            <>
              <CustomSelect value={department} onChange={setDepartment} options={departmentSelectOptions} />
              <CustomSelect value={intania} onChange={setIntania} options={intaniaSelectOptions} />
              <CustomSelect value={yearFilter} onChange={setYearFilter} options={yearFilterOptions} />
              <CustomSelect value={gpaFilter} onChange={setGpaFilter} options={gpaFilterOptions} />
            </>
          )}

          {mode === "company" ? (
            <CustomSelect
              value={companySort}
              onChange={(value) => setCompanySort(value as CompanySort)}
              options={companySortOptions}
            />
          ) : (
            <CustomSelect
              value={reviewSort}
              onChange={(value) => setReviewSort(value as ReviewSort)}
              options={reviewSortOptions}
            />
          )}

          <button
            type="button"
            onClick={() => setDirection((value) => (value === "desc" ? "asc" : "desc"))}
            className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 transition hover:border-zinc-400"
            title={direction === "desc" ? "มากไปน้อย" : "น้อยไปมาก"}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {direction === "desc" ? <path d="M12 5v14m0 0-5-5m5 5 5-5" /> : <path d="M12 19V5m0 0-5 5m5-5 5 5" />}
            </svg>
            {direction === "desc" ? "มาก-น้อย" : "น้อย-มาก"}
          </button>
          
        </div>
      </section>

      <div id="explore" className="mx-auto w-[min(100%-24px,1120px)] pb-10 pt-4 md:pb-14 md:pt-6">
        <div className="grid gap-6">
          <h2 className="m-0 text-center text-xl font-extrabold tracking-[-0.01em] text-zinc-900 md:text-2xl">
            {mode === "company" ? "ค้นหาบริษัทที่จริงใจ" : "ค้นหารีวิวที่จริงใจ"}
          </h2>

          {mode === "company" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {filteredCompanies.slice(0, visibleCount).map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredReviews.slice(0, visibleCount).map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  company={companyById.get(review.companyId)}
                  readMoreHref={`/company/${review.companyId}?position=${encodeURIComponent(review.position)}`}
                />
              ))}
            </div>
          )}

          {results.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center text-sm text-zinc-400">
              ไม่พบผลลัพธ์ที่ตรงกับเงื่อนไขที่เลือก
            </p>
          )}

          {visibleCount < results.length && (
            <>
              <div ref={sentinelRef} />
              <p className="text-center text-sm text-zinc-400">กำลังโหลดเพิ่มเติม...</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
