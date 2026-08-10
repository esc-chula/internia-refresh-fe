"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { HeroBackground } from "./HeroBackground";
import { CompanyCard } from "./CompanyCard";
import { CompanyLogo } from "./CompanyLogo";
import { ReviewCard } from "./ReviewCard";
import { CustomSelect } from "./CustomSelect";
import { MultiSelect } from "./MultiSelect";
import { SearchBox } from "./SearchBox";
import { companies, departments, intaniaBatches, reviews } from "@/lib/mock-data";

type Mode = "company" | "review";
type Direction = "asc" | "desc";
type CompanySort = "rating" | "reviews" | "name";
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

const companySearchIndex = new Fuse(companies, { keys: ["name", "tag"], threshold: 0.35 });

const reviewSearchItems = reviews
  .map((review) => ({ review, company: companyById.get(review.companyId) }))
  .filter((item): item is { review: (typeof reviews)[number]; company: (typeof companies)[number] } => Boolean(item.company));

const reviewSearchIndex = new Fuse(reviewSearchItems, {
  keys: ["review.position", "company.name"],
  threshold: 0.35,
});

const tagSelectOptions = TAG_OPTIONS.map((option) => ({ value: option, label: option }));

const companySortOptions = [
  { value: "reviews", label: "เรียงตาม: รีวิวมากที่สุด" },
  { value: "rating", label: "เรียงตาม: คะแนนสูงสุด" },
  { value: "name", label: "เรียงตาม: ชื่อ" },
];

const reviewSortOptions = [
  { value: "newest", label: "เรียงตาม: วันที่" },
  { value: "rating", label: "เรียงตาม: คะแนนบริษัท" },
];

const departmentSelectOptions = departments.map((option) => ({ value: option, label: option }));

const intaniaSelectOptions = intaniaBatches.map((option) => ({ value: option, label: `รุ่น ${option}` }));

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

function matchesOpenYear(openYears: string, years: string[]) {
  if (years.length === 0) return true;
  if (openYears === "ทุกชั้นปี") return true;
  const nums = (openYears.match(/\d+/g) ?? []).map(Number);
  if (nums.length === 0) return false;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return years.some((year) => Number(year) >= min && Number(year) <= max);
}

function matchesMinGpa(minGpa: number | null, gpas: string[]) {
  if (gpas.length === 0) return true;
  if (minGpa == null) return true;
  return gpas.some((gpa) => minGpa <= Number(gpa));
}

export function HomeExplore() {
  const [mode, setMode] = useState<Mode>("company");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<string[]>([]);
  const [department, setDepartment] = useState<string[]>([]);
  const [intania, setIntania] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string[]>([]);
  const [gpaFilter, setGpaFilter] = useState<string[]>([]);
  const [companySort, setCompanySort] = useState<CompanySort>("reviews");
  const [reviewSort, setReviewSort] = useState<ReviewSort>("newest");
  const [direction, setDirection] = useState<Direction>("desc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [previewFocused, setPreviewFocused] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dir = direction === "desc" ? 1 : -1;

  const hasActiveFilters =
    tag.length > 0 || department.length > 0 || intania.length > 0 || yearFilter.length > 0 || gpaFilter.length > 0;

  function clearFilters() {
    setTag([]);
    setDepartment([]);
    setIntania([]);
    setYearFilter([]);
    setGpaFilter([]);
  }

  const previewResults = useMemo(() => {
    const q = draft.trim();
    if (!q) return [];

    if (mode === "company") {
      return companySearchIndex
        .search(q)
        .slice(0, 6)
        .map(({ item }) => ({ company: item, matchedPosition: undefined as string | undefined }));
    }

    const seen = new Set<string>();
    const matches: { company: (typeof companies)[number]; matchedPosition?: string }[] = [];
    for (const { item } of reviewSearchIndex.search(q)) {
      const key = `${item.company.id}-${item.review.position}`;
      if (seen.has(key)) continue;
      seen.add(key);
      matches.push({ company: item.company, matchedPosition: item.review.position });
      if (matches.length >= 6) break;
    }
    return matches;
  }, [draft, mode]);

  const showPreview = previewFocused && previewResults.length > 0;

  const filteredCompanies = useMemo(() => {
    const q = query.trim();
    const base = q ? companySearchIndex.search(q).map((result) => result.item) : companies;
    const list = base.filter((company) => tag.length === 0 || tag.includes(company.tag));

    return [...list].sort((a, b) => {
      if (companySort === "rating") return (b.rating - a.rating) * dir;
      if (companySort === "reviews") return (b.reviewCount - a.reviewCount) * dir;
      return a.name.localeCompare(b.name) * -dir;
    });
  }, [query, tag, companySort, dir]);

  const filteredReviews = useMemo(() => {
    const q = query.trim();
    const base = q ? reviewSearchIndex.search(q).map((result) => result.item.review) : reviews;
    const list = base.filter((review) => {
      const company = companyById.get(review.companyId);
      if (!company) return false;
      if (tag.length > 0 && !tag.includes(company.tag)) return false;
      if (department.length > 0 && !department.includes(review.department)) return false;
      if (intania.length > 0 && !intania.includes(review.intania)) return false;
      if (!matchesOpenYear(review.openYears, yearFilter)) return false;
      if (!matchesMinGpa(review.minGpa, gpaFilter)) return false;
      return true;
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
      <section className="relative grid grid-cols-1 justify-items-center gap-4 border-b border-zinc-200 bg-zinc-100 px-4 py-14 text-center sm:px-6 md:gap-5 md:py-24">
        <HeroBackground />
        <h1 className="animate-fade-in-up relative z-10 m-0 text-[clamp(1.9rem,7vw,3.6rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-zinc-900 md:leading-[1.05]">
          รีวิวฝึกงานที่จริงใจจาก<br className="sm:hidden" />ชาววิศวฯ จุฬาฯ
        </h1>
        <p
          className="animate-fade-in-up relative z-10 m-0 max-w-[560px] text-lg leading-relaxed text-zinc-500 md:text-[1.1rem]"
          style={{ animationDelay: "80ms" }}
        >
          ร่วมแชร์ประสบการณ์ฝึกงานของคุณ
        </p>

        <div
          className="animate-fade-in-up relative z-20 w-[min(88%,400px)] sm:w-[min(100%,640px)]"
          style={{ animationDelay: "160ms" }}
        >
          <SearchBox
            modes={[
              { value: "company", label: "บริษัท" },
              { value: "review", label: "รีวิว" },
            ]}
            mode={mode}
            onModeChange={(value) => setMode(value as Mode)}
            value={draft}
            onChange={setDraft}
            onSubmit={() => {
              setQuery(draft);
              setPreviewFocused(false);
            }}
            onFocus={() => {
              if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
              setPreviewFocused(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(() => setPreviewFocused(false), 120);
            }}
            placeholder={mode === "company" ? "ค้นหาบริษัท" : "ค้นหาบริษัทหรือตำแหน่ง"}
          >
            {showPreview && (
              <div className="animate-dropdown-in absolute left-0 right-0 top-[calc(100%+8px)] max-h-72 overflow-y-auto rounded-2xl border border-zinc-200 bg-white text-left shadow-lift">
                {previewResults.map(({ company, matchedPosition }, index) => (
                  <Link
                    key={`${company.id}-${index}`}
                    href={
                      matchedPosition
                        ? `/company/${company.id}?position=${encodeURIComponent(matchedPosition)}`
                        : `/company/${company.id}`
                    }
                    className="flex items-center gap-3 border-b border-zinc-100 px-4 py-3 no-underline last:border-b-0 hover:bg-zinc-100"
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
          </SearchBox>
        </div>

        <div className="relative z-10 grid w-full grid-cols-1 max-w-[1120px] gap-2.5">
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-2.5">
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
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-700 transition active:scale-[0.96] hover:border-zinc-400"
              title={direction === "desc" ? "มากไปน้อย" : "น้อยไปมาก"}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {direction === "desc" ? <path d="M12 5v14m0 0-5-5m5 5 5-5" /> : <path d="M12 19V5m0 0-5 5m5-5 5 5" />}
              </svg>
              {direction === "desc" ? "มาก-น้อย" : "น้อย-มาก"}
            </button>
          </div>

          <div className="flex min-w-0 flex-wrap items-center justify-center gap-2.5">
            <MultiSelect values={tag} onChange={setTag} options={tagSelectOptions} placeholder="ประเภทบริษัท" />

            {mode === "review" && (
              <>
                <MultiSelect values={department} onChange={setDepartment} options={departmentSelectOptions} placeholder="ทุกภาควิชา" />
                <MultiSelect values={intania} onChange={setIntania} options={intaniaSelectOptions} placeholder="ทุกรุ่น" />
                <MultiSelect values={yearFilter} onChange={setYearFilter} options={yearFilterOptions} placeholder="ชั้นปีที่เปิดรับ" />
                <MultiSelect values={gpaFilter} onChange={setGpaFilter} options={gpaFilterOptions} placeholder="เกรดเฉลี่ยขั้นต่ำ" />
              </>
            )}

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
      </section>

      <div id="explore" className="mx-auto w-[min(100%-40px,1120px)] pb-10 pt-4 md:pb-14 md:pt-6">
        <div className="grid gap-6">
          <h2 className="m-0 text-center text-xl font-extrabold tracking-[-0.01em] text-zinc-900 md:text-2xl">
            {mode === "company" ? "ค้นหาบริษัทที่จริงใจ" : "ค้นหารีวิวที่จริงใจ"}
          </h2>

          {mode === "company" ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {filteredCompanies.slice(0, visibleCount).map((company, index) => (
                <div key={company.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                  <CompanyCard company={company} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredReviews.slice(0, visibleCount).map((review, index) => (
                <div key={review.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>
                  <ReviewCard
                    review={review}
                    company={companyById.get(review.companyId)}
                    readMoreHref={`/company/${review.companyId}?position=${encodeURIComponent(review.position)}`}
                  />
                </div>
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
