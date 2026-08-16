"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Company, Review } from "@/lib/api/types";
import { deleteReview, likeReview, unlikeReview } from "@/lib/api/reviews";
import { CompanyLogo } from "./CompanyLogo";
import { useConfirm, useToast } from "./Notifications";
import { FaceIcon, scoreToFace } from "./FaceIcon";

const scoreRows = [
  ["workScore", "ด้านเนื้องาน"],
  ["socialScore", "ด้านสังคม"],
  ["mentorScore", "ด้านพี่เลี้ยง"],
  ["experienceScore", "ด้านประสบการณ์"],
] as const;

function formatRelativeTime(createdAt: string) {
  const diffMs = Math.max(0, Date.now() - new Date(createdAt).getTime());
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "ตอนนี้";
  if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hours / 24);
  return `${days} วันที่แล้ว`;
}

const thaiMonthsAbbr = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

function formatShortThaiDate(date: string) {
  const d = new Date(date);
  const yearBE2 = (d.getFullYear() + 543) % 100;
  return `${thaiMonthsAbbr[d.getMonth()]} ${String(yearBE2).padStart(2, "0")}`;
}

function monthsSpan(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() >= start.getDate()) months += 1;
  return Math.max(1, months);
}

function formatDuration(review: Review) {
  const months = monthsSpan(review.startDate, review.endDate);
  const start = formatShortThaiDate(review.startDate);
  const end = formatShortThaiDate(review.endDate);
  const range = start === end ? start : `${start} - ${end}`;
  return `${range} (${months} เดือน)`;
}

function formatCompensation(review: Review) {
  if (review.hasCompensation === true) {
    return `${review.compensationAmount ?? "-"} ${review.compensationUnit ?? ""}`.trim();
  }
  if (review.hasCompensation === false) return "ไม่มีค่าตอบแทน";
  return null;
}

function formatOpenYears(review: Review) {
  if (review.hasYearLimit === true) {
    const years = review.acceptedYears ?? [];
    return years.length > 0 ? `ชั้นปีที่ ${years.join(", ")}` : null;
  }
  if (review.hasYearLimit === false) return "ทุกชั้นปี";
  return null;
}

export function ReviewCard({
  review,
  company,
  readMoreHref,
  onDeleted,
  showOwnerActions = false,
}: {
  review: Review;
  company?: Company;
  readMoreHref?: string;
  onDeleted?: (reviewId: string) => void;

  showOwnerActions?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likeCount);
  const [likedByMe, setLikedByMe] = useState(review.likedByMe);
  const [liking, setLiking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const showToast = useToast();
  const confirm = useConfirm();

  const reviewerName = review.anonymous ? "ไม่ระบุตัวตน" : (review.reviewer.username ?? "ไม่ระบุตัวตน");
  const compensationText = formatCompensation(review);
  const openYearsText = formatOpenYears(review);

  async function toggleLike(event: React.MouseEvent) {
    event.stopPropagation();
    if (liking) return;

    const previousCount = likeCount;
    const previousLiked = likedByMe;
    const nextLiked = !likedByMe;

    setLikedByMe(nextLiked);
    setLikeCount((count) => count + (nextLiked ? 1 : -1));
    setLiking(true);
    try {
      await (nextLiked ? likeReview(review.id) : unlikeReview(review.id));
    } catch {
      setLikedByMe(previousLiked);
      setLikeCount(previousCount);
      showToast("กดถูกใจไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    } finally {
      setLiking(false);
    }
  }

  async function handleDelete(event: React.MouseEvent) {
    event.stopPropagation();
    if (deleting) return;

    const confirmed = await confirm("ต้องการลบรีวิวนี้ใช่หรือไม่? ไม่สามารถกู้คืนได้", {
      confirmLabel: "ลบรีวิว",
      cancelLabel: "ยกเลิก",
    });
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteReview(review.id);
      showToast("ลบรีวิวเรียบร้อยแล้ว");
      onDeleted?.(review.id);
    } catch {
      setDeleting(false);
      showToast("ลบรีวิวไม่สำเร็จ กรุณาลองใหม่อีกครั้ง", "error");
    }
  }

  return (
    <article
      onClick={(event) => {
        if (!readMoreHref) return;
        const target = event.target as HTMLElement;
        if (target.closest("a, button")) return;
        router.push(readMoreHref);
      }}
      className={`grid overflow-hidden rounded-2xl border border-zinc-200 bg-white text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99] active:translate-y-0 ${
        readMoreHref ? "cursor-pointer" : ""
      }`}
    >
      {(company || (review.canEdit && showOwnerActions)) && (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 bg-zinc-50 px-5 py-2">
          {company ? (
            <Link
              href={`/company/${company.slug}`}
              className="flex min-w-0 items-center gap-2.5 text-zinc-900 no-underline"
            >
              <CompanyLogo logoUrl={company.logoUrl} alt={company.name} size={24} />
              <span className="truncate text-sm font-semibold">{company.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {review.canEdit && showOwnerActions && (
            <div className="flex shrink-0 items-center gap-3">
              <Link
                href={`/review/${review.id}/edit`}
                className="whitespace-nowrap text-sm font-semibold text-internia-primary no-underline transition hover:text-internia-primaryDark"
              >
                แก้ไข
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="whitespace-nowrap text-sm font-semibold text-zinc-500 transition hover:text-internia-primary disabled:opacity-60"
              >
                ลบ
              </button>
            </div>
          )}
        </div>
      )}
      <div className="grid gap-[18px] p-5 pb-[22px]">
      <div className="flex items-start gap-3">
        <FaceIcon score={scoreToFace(review.experienceScore)} className="h-10 w-10 shrink-0 rounded-xl" />
        <div className="grid min-w-0 flex-1 gap-1">
          <h2 className="m-0 min-w-0 text-md font-bold leading-tight">{reviewerName}</h2>
          {!review.anonymous && review.reviewer.department && (
            <p className="m-0 min-w-0 text-sm leading-tight text-zinc-500">{review.reviewer.department}</p>
          )}
        </div>
        <div className="grid shrink-0 justify-items-end gap-1.5">
          <span className="whitespace-nowrap text-sm leading-tight text-zinc-500">{formatRelativeTime(review.createdAt)}</span>
          <button
            type="button"
            onClick={toggleLike}
            disabled={liking}
            className={`inline-flex min-w-0 items-center gap-1.5 text-sm font-normal leading-tight transition disabled:opacity-60 ${
              likedByMe ? "text-internia-primary" : "text-zinc-500 hover:text-internia-primary"
            }`}
          >
            <HeartIcon filled={likedByMe} className="h-[18px] w-[18px] shrink-0" />
            <span className="whitespace-nowrap">{likeCount}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5">
        {scoreRows.map(([key, label]) => (
          <div key={key} className="inline-flex min-w-0 items-center gap-2 text-sm font-normal leading-tight text-zinc-600">
            <FaceIcon score={scoreToFace(review[key])} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 pt-0.5">
        <h3 className="m-0 text-lg font-bold leading-tight">{review.position}</h3>
        <div className="grid gap-2 rounded-xl bg-zinc-50 p-3">
          <FactRow items={[{ icon: <ClockIcon />, text: formatDuration(review) }]} />
          <FactRow
            items={[
              { icon: <WorkModeIcon />, text: review.workMode },
              compensationText ? { icon: <CoinIcon />, text: compensationText } : null,
            ]}
          />
          <FactRow
            items={[
              openYearsText ? { icon: <GraduationIcon />, text: `รับ${openYearsText}` } : null,
              review.hasMinGpa && review.minGpa != null
                ? { icon: <GpaIcon />, text: `เกรดเฉลี่ยขั้นต่ำ ${review.minGpa.toFixed(2)}` }
                : null,
            ]}
          />
        </div>
      </div>

      <div className="grid gap-[18px] border-t border-zinc-100 pt-[18px] text-sm leading-[1.35] text-zinc-700">
        {review.applicationSection && (
          <ReviewSection
            title="ขั้นตอนการสมัคร"
            icon={<ApplicationIcon />}
            text={review.applicationSection}
            clamp={readMoreHref ? true : !expanded}
          />
        )}
        {expanded && !readMoreHref && (
          <div className="animate-fade-in-up grid gap-[18px]">
            {review.workSection && <ReviewSection title="งานที่ได้รับ" icon={<WorkIcon />} text={review.workSection} />}
            {review.atmosphereSection && (
              <ReviewSection title="บรรยากาศการทำงาน" icon={<AtmosphereIcon />} text={review.atmosphereSection} />
            )}
            {review.welfareSection && (
              <ReviewSection title="สวัสดิการและการเดินทาง" icon={<WelfareIcon />} text={review.welfareSection} />
            )}
            {review.adviceSection && <ReviewSection title="สิ่งที่อยากบอกต่อ" icon={<AdviceIcon />} text={review.adviceSection} />}
          </div>
        )}
        {readMoreHref ? (
          <Link
            href={readMoreHref}
            className="justify-self-center border-0 bg-transparent p-0 text-sm font-semibold text-internia-primary no-underline transition hover:text-internia-primaryDark"
          >
            เพิ่มเติม
          </Link>
        ) : (
          <button
            className="justify-self-center border-0 bg-transparent p-0 text-sm font-semibold text-internia-primary transition hover:text-internia-primaryDark"
            type="button"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "ย่อ" : "เพิ่มเติม"}
          </button>
        )}
      </div>
      </div>
    </article>
  );
}

function FactRow({ items }: { items: ({ icon: React.ReactElement; text: string } | null)[] }) {
  const facts = items.filter((item): item is { icon: React.ReactElement; text: string } => item !== null);
  if (facts.length === 0) return null;

  return (
    <div className={facts.length > 1 ? "grid grid-cols-2 gap-x-3 gap-y-2" : "grid"}>
      {facts.map((fact) => (
        <div key={fact.text} className="flex min-w-0 items-center gap-2 text-sm leading-tight text-zinc-600">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
            {fact.icon}
          </span>
          <span className="truncate">{fact.text}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewSection({
  title,
  text,
  icon,
  clamp = false,
}: {
  title: string;
  text: string;
  icon: React.ReactNode;
  clamp?: boolean;
}) {
  return (
    <section className="grid gap-2">
      <h4 className="m-0 flex items-center gap-2 text-sm font-bold leading-tight text-zinc-900">
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-internia-primarySoft text-internia-primary">
          {icon}
        </span>
        {title}
      </h4>
      <p className="m-0 font-normal">{clamp ? `${text.slice(0, 170)} ...` : text}</p>
    </section>
  );
}

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.3 15.2c0 1.1 1.2 1.8 2.7 1.8s2.7-.7 2.7-1.9c0-2.6-5.4-1.1-5.4-3.7 0-1.2 1.2-1.8 2.7-1.8s2.7.6 2.7 1.7M12 7.3v1.1M12 15.9v1.1" />
    </svg>
  );
}

function WorkModeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 8 10-5 10 5-10 5-10-5Z" />
      <path d="M6 10.5V16c0 1.1 2.7 3 6 3s6-1.9 6-3v-5.5" />
    </svg>
  );
}

function GpaIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="7" cy="7" r="2.6" />
      <circle cx="17" cy="17" r="2.6" />
      <path d="M17.5 6.5 6.5 17.5" />
    </svg>
  );
}

function ApplicationIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="6" y="4" width="12" height="16" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </svg>
  );
}

function WorkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function AtmosphereIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20v-.8a5.7 5.7 0 0 1 5.7-5.7h1.6a5.7 5.7 0 0 1 5.7 5.7v.8" />
      <circle cx="17.5" cy="8.5" r="2.3" />
      <path d="M15.8 14a4.6 4.6 0 0 1 5.7 4.5v1.5" />
    </svg>
  );
}

function WelfareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function AdviceIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
