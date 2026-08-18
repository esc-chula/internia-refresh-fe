"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "./CustomSelect";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreToFace } from "./FaceIcon";
import { createCompany, listCompanies } from "@/lib/api/companies";
import { createReview, updateReview } from "@/lib/api/reviews";
import { ApiError } from "@/lib/api/types";
import type { Company, Review, ReviewPayload, WorkMode } from "@/lib/api/types";
import { companyTypes } from "@/lib/company-types";

const FETCH_ALL_LIMIT = 300;

const companyTypeOptions = companyTypes.map((option) => ({ value: option, label: option }));
const workModeOptions = ["Work from home", "Hybrid", "Onsite"].map((option) => ({ value: option, label: option }));
const salaryUnitOptions = ["บาท/เดือน", "บาท/วัน"].map((option) => ({ value: option, label: option }));

const scoreFields = [
  ["work", "ด้านเนื้องาน", "งานไม่ค่อยมีบทบาท ไม่ชัดเจน", "งานท้าทาย ได้เรียนรู้มาก"],
  ["social", "ด้านสังคม", "ไม่ค่อยเอื้อต่อการทำงาน", "สบายใจ ทำงานร่วมกับทีมได้ดี"],
  ["mentor", "ด้านพี่เลี้ยง", "ไม่ค่อยสนับสนุน", "สนับสนุนดีเยี่ยม"],
  ["experience", "ด้านประสบการณ์", "ประสบการณ์ที่ไม่ค่อยดี", "ประสบการณ์ที่ดีมาก"],
  ["overall", "คะแนนโดยรวม", "ไม่เป็นไปตามที่คาดหวัง", "ดีกว่าที่คาดหวัง"],
] as const;

const outlineColors = ["rgba(234, 67, 53, 0.7)", "rgba(242, 153, 74, 0.78)", "rgba(242, 201, 76, 0.85)", "rgba(124, 179, 66, 0.8)", "rgba(39, 174, 96, 0.8)"];

const steps = [
  { title: "ข้อมูลบริษัทและการฝึกงาน" },
  { title: "เขียนรีวิว" },
  { title: "ให้คะแนนและส่งรีวิว" },
] as const;

const DRAFT_KEY = "internia_review_draft";

type ReviewDraft = {
  step?: 1 | 2 | 3;
  company?: string;
  companyType?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  workMode?: string;
  salaryMode?: "yes" | "no" | null;
  salaryAmount?: string;
  salaryUnit?: string;
  yearLimit?: "yes" | "no" | null;
  yearValues?: string[];
  gpaMode?: "yes" | "no" | null;
  minGpaValue?: string;
  applicationText?: string;
  workText?: string;
  atmosphereText?: string;
  welfareText?: string;
  adviceText?: string;
  anonymous?: boolean;
  scores?: Record<string, number | null>;
};

function loadDraft(): ReviewDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as ReviewDraft) : null;
  } catch {
    return null;
  }
}

function saveDraft(draft: ReviewDraft) {
  try {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {}
}

function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {}
}

function isDraftEmpty(d: ReviewDraft) {
  return (
    !d.company &&
    !d.companyType &&
    !d.position &&
    !d.startDate &&
    !d.endDate &&
    !d.workMode &&
    !d.salaryMode &&
    !d.salaryAmount &&
    !d.salaryUnit &&
    !d.yearLimit &&
    !(d.yearValues && d.yearValues.length > 0) &&
    !d.gpaMode &&
    !d.minGpaValue &&
    !d.applicationText &&
    !d.workText &&
    !d.atmosphereText &&
    !d.welfareText &&
    !d.adviceText &&
    !d.anonymous &&
    !(d.scores && Object.keys(d.scores).length > 0)
  );
}

export function CreateReviewForm({
  mode = "create",
  reviewId,
  initialReview,
  fixedCompanySlug,
  fixedCompanyName,
}: {
  mode?: "create" | "edit";
  reviewId?: string;
  initialReview?: Review;
  fixedCompanySlug?: string;
  fixedCompanyName?: string;
} = {}) {
  const router = useRouter();

  const [draft, setDraft] = useState<ReviewDraft | null>(null);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const formTopRef = useRef<HTMLDivElement>(null);
  const [showMoreDetails, setShowMoreDetails] = useState(true);
  const [company, setCompany] = useState("");
  const [companyFocused, setCompanyFocused] = useState(false);
  const [companyType, setCompanyType] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [knownCompanies, setKnownCompanies] = useState<Company[]>([]);

  const [position, setPosition] = useState(initialReview?.position ?? "");
  const [startDate, setStartDate] = useState(initialReview?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialReview?.endDate ?? "");
  const [workMode, setWorkMode] = useState<string>(initialReview?.workMode ?? "");

  const [salaryMode, setSalaryMode] = useState<"yes" | "no" | null>(
    initialReview?.hasCompensation === true ? "yes" : initialReview?.hasCompensation === false ? "no" : null,
  );
  const [salaryAmount, setSalaryAmount] = useState(initialReview?.compensationAmount != null ? String(initialReview.compensationAmount) : "");
  const [salaryUnit, setSalaryUnit] = useState(initialReview?.compensationUnit ?? "");

  const [yearLimit, setYearLimit] = useState<"yes" | "no" | null>(
    initialReview?.hasYearLimit === true ? "yes" : initialReview?.hasYearLimit === false ? "no" : null,
  );
  const [yearValues, setYearValues] = useState<string[]>(initialReview?.acceptedYears?.map(String) ?? []);

  const [gpaMode, setGpaMode] = useState<"yes" | "no" | null>(
    initialReview?.hasMinGpa === true ? "yes" : initialReview?.hasMinGpa === false ? "no" : null,
  );
  const [minGpaValue, setMinGpaValue] = useState(initialReview?.minGpa != null ? String(initialReview.minGpa) : "");

  const [applicationText, setApplicationText] = useState(initialReview?.applicationSection ?? "");
  const [workText, setWorkText] = useState(initialReview?.workSection ?? "");
  const [atmosphereText, setAtmosphereText] = useState(initialReview?.atmosphereSection ?? "");
  const [welfareText, setWelfareText] = useState(initialReview?.welfareSection ?? "");
  const [adviceText, setAdviceText] = useState(initialReview?.adviceSection ?? "");

  const [anonymous, setAnonymous] = useState(initialReview?.anonymous ?? false);
  const [scores, setScores] = useState<Record<string, number | null>>(
    initialReview
      ? {
          work: initialReview.workScore,
          social: initialReview.socialScore,
          mentor: initialReview.mentorScore,
          experience: initialReview.experienceScore,
          overall: initialReview.overallScore,
        }
      : {},
  );

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (mode !== "create") return;
    listCompanies({ limit: FETCH_ALL_LIMIT })
      .then((res) => setKnownCompanies(res.companies))
      .catch(() => {});
  }, [mode]);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    if (mode !== "create") {
      setHydrated(true);
      return;
    }
    const loaded = loadDraft();
    if (loaded) {
      setDraft(loaded);
      if (loaded.step) setStep(loaded.step);
      if (loaded.company) setCompany(loaded.company);
      if (loaded.companyType) setCompanyType(loaded.companyType);
      if (loaded.position) setPosition(loaded.position);
      if (loaded.startDate) setStartDate(loaded.startDate);
      if (loaded.endDate) setEndDate(loaded.endDate);
      if (loaded.workMode) setWorkMode(loaded.workMode);
      if (loaded.salaryMode !== undefined) setSalaryMode(loaded.salaryMode);
      if (loaded.salaryAmount) setSalaryAmount(loaded.salaryAmount);
      if (loaded.salaryUnit) setSalaryUnit(loaded.salaryUnit);
      if (loaded.yearLimit !== undefined) setYearLimit(loaded.yearLimit);
      if (loaded.yearValues) setYearValues(loaded.yearValues);
      if (loaded.gpaMode !== undefined) setGpaMode(loaded.gpaMode);
      if (loaded.minGpaValue) setMinGpaValue(loaded.minGpaValue);
      if (loaded.applicationText) setApplicationText(loaded.applicationText);
      if (loaded.workText) setWorkText(loaded.workText);
      if (loaded.atmosphereText) setAtmosphereText(loaded.atmosphereText);
      if (loaded.welfareText) setWelfareText(loaded.welfareText);
      if (loaded.adviceText) setAdviceText(loaded.adviceText);
      if (loaded.anonymous !== undefined) setAnonymous(loaded.anonymous);
      if (loaded.scores) setScores(loaded.scores);
    }
    setHydrated(true);

  }, []);

  useEffect(() => {
    if (!hydrated || mode !== "create") return;
    const current: ReviewDraft = {
      step,
      company,
      companyType,
      position,
      startDate,
      endDate,
      workMode,
      salaryMode,
      salaryAmount,
      salaryUnit,
      yearLimit,
      yearValues,
      gpaMode,
      minGpaValue,
      applicationText,
      workText,
      atmosphereText,
      welfareText,
      adviceText,
      anonymous,
      scores,
    };
    if (isDraftEmpty(current)) {
      clearDraft();
      return;
    }
    saveDraft(current);
  }, [
    hydrated,
    mode,
    step,
    company,
    companyType,
    position,
    startDate,
    endDate,
    workMode,
    salaryMode,
    salaryAmount,
    salaryUnit,
    yearLimit,
    yearValues,
    gpaMode,
    minGpaValue,
    applicationText,
    workText,
    atmosphereText,
    welfareText,
    adviceText,
    anonymous,
    scores,
  ]);

  const normalizedCompany = company.trim().toLowerCase();
  const matchedCompanyItem = knownCompanies.find((item) => item.name.toLowerCase() === normalizedCompany);
  const matchedCompany = Boolean(matchedCompanyItem);
  const showCompanyType = normalizedCompany.length > 0 && !matchedCompany;
  const filteredCompanies = useMemo(
    () => knownCompanies.filter((item) => item.name.toLowerCase().includes(normalizedCompany)).slice(0, 5),
    [normalizedCompany, knownCompanies],
  );
  const showCompanyList = companyFocused && filteredCompanies.length > 0;

  function goToStep(next: 1 | 2 | 3) {
    setStep(next);
    formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit() {
    if (submittingRef.current) return;
    submittingRef.current = true;
    try {
      await doSubmit();
    } finally {
      submittingRef.current = false;
    }
  }

  async function doSubmit() {
    setSubmitError(null);

    if (mode === "create" && !company.trim()) {
      setSubmitError("กรุณากรอกชื่อบริษัท");
      return;
    }
    if (mode === "create" && showCompanyType && !companyType) {
      setSubmitError("กรุณาเลือกประเภทบริษัท");
      return;
    }
    if (!position.trim()) {
      setSubmitError("กรุณากรอกตำแหน่งที่ฝึกงาน");
      return;
    }
    if (!startDate || !endDate) {
      setSubmitError("กรุณากรอกวันที่เริ่มและสิ้นสุดการฝึกงาน");
      return;
    }
    if (!workMode) {
      setSubmitError("กรุณาเลือกรูปแบบการทำงาน");
      return;
    }
    const requiredScoreKeys = ["work", "social", "mentor", "experience", "overall"];
    if (requiredScoreKeys.some((key) => !scores[key])) {
      setSubmitError("กรุณาให้คะแนนครบทุกด้าน");
      return;
    }

    setSubmitting(true);
    try {
      const payload: ReviewPayload = {
        position: position.trim(),
        startDate,
        endDate,
        workMode: workMode as WorkMode,

        ...(salaryMode !== null ? { hasCompensation: salaryMode === "yes" } : {}),
        ...(salaryMode === "yes" ? { compensationAmount: Number(salaryAmount), compensationUnit: salaryUnit } : {}),
        ...(yearLimit !== null ? { hasYearLimit: yearLimit === "yes" } : {}),
        ...(yearLimit === "yes" ? { acceptedYears: yearValues.map(Number) } : {}),
        ...(gpaMode !== null ? { hasMinGpa: gpaMode === "yes" } : {}),
        ...(gpaMode === "yes" ? { minGpa: Number(minGpaValue) } : {}),
        ...(applicationText.trim() ? { applicationSection: applicationText.trim() } : {}),
        ...(workText.trim() ? { workSection: workText.trim() } : {}),
        ...(atmosphereText.trim() ? { atmosphereSection: atmosphereText.trim() } : {}),
        ...(welfareText.trim() ? { welfareSection: welfareText.trim() } : {}),
        ...(adviceText.trim() ? { adviceSection: adviceText.trim() } : {}),
        workScore: scores.work!,
        socialScore: scores.social!,
        mentorScore: scores.mentor!,
        experienceScore: scores.experience!,
        overallScore: scores.overall!,
        anonymous,
      };

      if (mode === "edit" && reviewId && fixedCompanySlug) {
        await updateReview(reviewId, payload);
        router.push(`/company/${fixedCompanySlug}`);
        return;
      }

      let slug = matchedCompanyItem?.slug;
      if (!slug) {
        const created = await createCompany({ name: company.trim(), category: companyType, logo: logoFile });
        slug = created.slug;
      }

      await createReview(slug, payload);
      clearDraft();
      router.push(`/company/${slug}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "ส่งรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="grid justify-items-center gap-5" onSubmit={(event) => event.preventDefault()}>
      <div ref={formTopRef} className="grid w-full max-w-[760px] gap-[26px] max-sm:gap-[22px]">
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center justify-between gap-2 text-sm font-semibold text-zinc-700">
              <span>ขั้นตอน {step} จาก {steps.length}</span>
              <span className="text-zinc-400">{steps[step - 1].title}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {steps.map((item, index) => (
                <div key={item.title} className={`h-1.5 rounded-full transition-colors duration-300 ${index < step ? "bg-internia-primary" : "bg-zinc-200"}`} />
              ))}
            </div>
          </div>

          {draft && !draftDismissed && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              <span>กู้คืนข้อมูลที่เขียนค้างไว้ให้แล้ว</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearDraft();
                    window.location.reload();
                  }}
                  className="font-semibold text-internia-primary transition hover:text-internia-primaryDark"
                >
                  ลบร่างนี้แล้วเริ่มใหม่
                </button>
                <button
                  type="button"
                  onClick={() => setDraftDismissed(true)}
                  aria-label="ปิดข้อความนี้"
                  className="text-zinc-400 transition hover:text-zinc-600"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className={step === 1 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          {mode === "edit" ? (
            <FormSection title="ข้อมูลบริษัท" icon={<BuildingIcon />}>
              <Field label="บริษัท">
                <div className="flex h-11 items-center gap-2.5 rounded-full border border-zinc-200 bg-zinc-50 px-4 text-sm text-zinc-700">
                  {fixedCompanyName}
                </div>
              </Field>
            </FormSection>
          ) : (
          <FormSection title="ข้อมูลบริษัท" icon={<BuildingIcon />}>
            <Field label="บริษัท" required>
              <div className="relative">
                {matchedCompanyItem ? (
                  <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
                    <CompanyLogo logoUrl={matchedCompanyItem.logoUrl} alt={matchedCompanyItem.name} size={20} />
                  </div>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                )}
                <input
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  onFocus={() => setCompanyFocused(true)}
                  onBlur={() => window.setTimeout(() => setCompanyFocused(false), 120)}
                  placeholder="ค้นหาหรือพิมพ์ชื่อบริษัท"
                  className={`${inputClassName} pl-11`}
                />
                {showCompanyList && (
                  <div className="animate-dropdown-in absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lift">
                    {filteredCompanies.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setCompany(item.name);
                          setCompanyFocused(false);
                        }}
                        className="flex w-full items-center gap-3 border-b border-zinc-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-zinc-100"
                      >
                        <CompanyLogo logoUrl={item.logoUrl} alt={item.name} size={36} />
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-zinc-900">{item.name}</div>
                          <div className="truncate text-sm text-zinc-500">{item.category}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {showCompanyType && (
              <>
                <Field label="ประเภทบริษัท" required>
                  <CustomSelect
                    value={companyType}
                    onChange={setCompanyType}
                    placeholder="เลือกประเภทบริษัท"
                    options={companyTypeOptions}
                  />
                </Field>

                <Field label="โลโก้บริษัท">
                  <label className="flex h-11 w-full cursor-pointer items-center gap-2.5 rounded-full border border-dashed border-zinc-300 bg-white px-4 text-sm text-zinc-500 transition hover:border-zinc-400">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-zinc-400">
                      <path d="M12 16V4m0 0 4 4m-4-4-4 4" />
                      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                    </svg>
                    <span className="min-w-0 truncate">{logoFile ? logoFile.name : "อัปโหลดโลโก้บริษัท"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => setLogoFile(event.target.files?.[0] ?? null)}
                    />
                  </label>
                </Field>
              </>
            )}
          </FormSection>
          )}

          <FormSection title="ข้อมูลการฝึกงาน" icon={<BriefcaseIcon />}>
            <Field label="ตำแหน่งที่ฝึกงาน" required>
              <input
                value={position}
                onChange={(event) => setPosition(event.target.value)}
                className={inputClassName}
                placeholder="ตำแหน่งที่ฝึกงาน"
              />
            </Field>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Field label="วันที่เริ่มฝึกงาน" required>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className={inputClassName}
                />
              </Field>
              <Field label="วันที่สิ้นสุด" required>
                <input
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="รูปแบบการทำงาน" required>
              <CustomSelect
                value={workMode}
                onChange={setWorkMode}
                placeholder="เลือกรูปแบบการทำงาน"
                options={workModeOptions}
              />
            </Field>

            <div className="grid grid-cols-1 gap-3 rounded-2xl border border-zinc-200 p-4">
              <button
                type="button"
                onClick={() => setShowMoreDetails((value) => !value)}
                className="flex items-center justify-between gap-2 text-left text-sm font-semibold text-zinc-700"
              >
                <span>
                  รายละเอียดเพิ่มเติม <OptionalTag />
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className={`shrink-0 text-zinc-400 transition-transform ${showMoreDetails ? "rotate-180" : ""}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {showMoreDetails && (
                <div className="animate-fade-in-up grid grid-cols-1 gap-[18px]">
                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      ค่าตอบแทน <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={salaryMode === "no"} onClick={() => setSalaryMode(salaryMode === "no" ? null : "no")}>
                          ไม่มี
                        </ToggleBox>
                        <ToggleBox selected={salaryMode === "yes"} onClick={() => setSalaryMode(salaryMode === "yes" ? null : "yes")}>
                          มี
                        </ToggleBox>
                      </div>
                      {salaryMode === "yes" && (
                        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(120px,140px)]">
                          <input
                            value={salaryAmount}
                            onChange={(event) => setSalaryAmount(event.target.value)}
                            className={inputClassName}
                            inputMode="numeric"
                            placeholder="15000"
                          />
                          <CustomSelect
                            value={salaryUnit}
                            onChange={setSalaryUnit}
                            placeholder="เลือกหน่วย"
                            options={salaryUnitOptions}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      ชั้นปีที่เปิดรับ <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={yearLimit === "no"} onClick={() => setYearLimit(yearLimit === "no" ? null : "no")}>
                          ไม่จำกัด
                        </ToggleBox>
                        <ToggleBox selected={yearLimit === "yes"} onClick={() => setYearLimit(yearLimit === "yes" ? null : "yes")}>
                          จำกัด
                        </ToggleBox>
                      </div>
                      {yearLimit === "yes" && (
                        <div className="grid gap-[10px] sm:grid-cols-2">
                          {["1", "2", "3", "4"].map((value) => {
                            const checked = yearValues.includes(value);
                            return (
                              <label
                                key={value}
                                className={`flex cursor-pointer items-center gap-[10px] rounded-md border px-[14px] py-3 ${
                                  checked ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() =>
                                    setYearValues((current) =>
                                      checked ? current.filter((item) => item !== value) : [...current, value],
                                    )
                                  }
                                  className="h-[18px] w-[18px] accent-internia-primary"
                                />
                                <span className="text-sm text-zinc-700">ชั้นปีที่ {value}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                      เกรดเฉลี่ยขั้นต่ำ <OptionalTag />
                    </div>
                    <div className="grid gap-[10px]">
                      <div className="grid gap-[10px] sm:grid-cols-2">
                        <ToggleBox selected={gpaMode === "no"} onClick={() => setGpaMode(gpaMode === "no" ? null : "no")}>
                          ไม่มี
                        </ToggleBox>
                        <ToggleBox selected={gpaMode === "yes"} onClick={() => setGpaMode(gpaMode === "yes" ? null : "yes")}>
                          มี
                        </ToggleBox>
                      </div>
                      {gpaMode === "yes" && (
                        <input
                          value={minGpaValue}
                          onChange={(event) => setMinGpaValue(event.target.value)}
                          className={inputClassName}
                          inputMode="decimal"
                          placeholder="เช่น 2.75"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormSection>
          </div>

          <div className={step === 2 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          <FormSection title="รีวิว" icon={<MessageIcon />}>
            <TextArea
              label="ขั้นตอนการสมัคร"
              placeholder="สมัครผ่านช่องทางไหน มีกี่รอบ ใช้เวลานานไหม ต้องเตรียมอะไรเป็นพิเศษ"
              value={applicationText}
              onChange={setApplicationText}
            />
            <TextArea
              label="งานที่ได้รับ"
              placeholder="หน้าที่ที่รับผิดชอบ โปรเจคที่ได้ทำ ความรู้หรือเครื่องมือที่ใช้ เนื้องานตรงกับตำแหน่งที่สมัครไหม"
              value={workText}
              onChange={setWorkText}
            />
            <TextArea
              label="บรรยากาศการทำงาน"
              placeholder="บรรยากาศภายในทีม วัฒนธรรมองค์กร พี่เลี้ยง"
              value={atmosphereText}
              onChange={setAtmosphereText}
            />
            <TextArea
              label="สวัสดิการและการเดินทาง"
              placeholder="สวัสดิการที่ได้รับ สิ่งอำนวยความสะดวก การเดินทางไปทำงาน"
              value={welfareText}
              onChange={setWelfareText}
            />
            <TextArea
              label="สิ่งที่อยากบอกต่อ"
              placeholder="ชอบอะไร ไม่ชอบอะไร ได้เรียนรู้อะไร และอยากแนะนำคนที่สนใจว่าอะไร"
              value={adviceText}
              onChange={setAdviceText}
            />
          </FormSection>
          </div>

          <div className={step === 3 ? "animate-fade-in-up grid w-full gap-[26px] max-sm:gap-[22px]" : "hidden"}>
          <section className="grid gap-[14px]">
            <div className="grid gap-[1.4rem]">
              <h2 className="m-0 flex items-center gap-2 text-[1.2rem] font-bold text-zinc-900">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-internia-primarySoft text-internia-primary">
                  <StarIcon />
                </span>
                แบบประเมิน
              </h2>
              {scoreFields.map(([key, title, low, high]) => (
                <div key={key} className="grid gap-2">
                  <div className="text-sm font-medium leading-[1.4] text-zinc-700">
                    {title} <span className="text-internia-primary">*</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid items-center gap-3 max-sm:grid-cols-[minmax(72px,1fr)_auto_minmax(72px,1fr)] sm:grid-cols-[minmax(92px,1fr)_auto_minmax(92px,1fr)]">
                      <div className="text-right text-sm leading-[1.4] text-zinc-500 max-sm:text-sm max-sm:leading-[1.35]">{low}</div>
                      <div className="grid grid-cols-5 justify-center gap-[0.3rem] max-sm:gap-[0.24rem]">
                        {[1, 2, 3, 4, 5].map((score) => {
                          const selected = scores[key] === score;
                          return (
                            <button
                              key={score}
                              type="button"
                              onClick={() =>
                                setScores((current) => ({
                                  ...current,
                                  [key]: selected ? null : score,
                                }))
                              }
                              className={`grid place-items-center overflow-hidden rounded-[10px] bg-white transition hover:scale-[1.04] ${
                                selected ? "shadow-[0_0_0_2px_#000]" : ""
                              } max-sm:h-[30px] max-sm:w-[30px] h-[34px] w-[34px]`}
                              style={{
                                boxShadow: selected ? "0 0 0 2px #000" : `inset 0 0 0 2px ${outlineColors[score - 1]}`,
                              }}
                            >
                              {selected ? (
                                <FaceIcon score={scoreToFace(score)} className="h-full w-full rounded-[10px]" />
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-left text-sm leading-[1.4] text-zinc-500 max-sm:text-sm max-sm:leading-[1.35]">{high}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-2">
            <label
              className={`flex cursor-pointer items-center gap-[10px] rounded-md border px-[14px] py-3 ${
                anonymous ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous((value) => !value)}
                className="h-[18px] w-[18px] accent-internia-primary"
              />
              <span className="text-sm text-zinc-700">ส่งรีวิวแบบไม่ระบุตัวตน</span>
            </label>
          </div>

          {submitError && <p className="m-0 text-sm text-internia-primary">{submitError}</p>}
          </div>

          {step === 1 && (
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark"
            >
              ถัดไป
            </button>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="min-h-11 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={() => goToStep(3)}
                className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark"
              >
                ถัดไป
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => goToStep(2)}
                disabled={submitting}
                className="min-h-11 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400 disabled:opacity-60"
              >
                ย้อนกลับ
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark disabled:opacity-60"
              >
                {submitting ? "กำลังส่ง..." : mode === "edit" ? "บันทึกการแก้ไข" : "ยืนยันส่งรีวิว"}
              </button>
            </div>
          )}
      </div>
    </form>
  );
}

function FormSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-[14px]">
      <h2 className="m-0 flex items-center gap-2 text-[1.2rem] font-bold text-zinc-900">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-internia-primarySoft text-internia-primary">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function BuildingIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
    </svg>
  );
}

function OptionalTag() {
  return <span className="font-normal text-zinc-400">(ไม่บังคับ)</span>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid grid-cols-1 gap-2">
      <span className="text-sm font-medium leading-[1.4] text-zinc-700">
        {label} {required ? <span className="text-internia-primary">*</span> : <OptionalTag />}
      </span>
      {children}
    </label>
  );
}

function TextArea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 64)}px`;
  }, [value]);

  return (
    <div className="grid gap-2">
      <p className="m-0 text-sm font-medium leading-[1.4] text-zinc-700">
        {label} <OptionalTag />
      </p>
      <textarea
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={2}
        className="min-h-[64px] w-full resize-none overflow-hidden rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10"
      />
    </div>
  );
}

function ToggleBox({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-[10px] rounded-md border px-[14px] py-3 text-left ${
        selected ? "border-zinc-900 bg-white" : "border-zinc-300 bg-white"
      }`}
    >
      <span
        className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 ${
          selected ? "border-internia-primary" : "border-zinc-400"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-internia-primary" />}
      </span>
      <span className="text-sm text-zinc-700">{children}</span>
    </button>
  );
}

const inputClassName =
  "h-11 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10";
