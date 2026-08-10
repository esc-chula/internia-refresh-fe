"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Company, Review } from "@/lib/mock-data";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon } from "./FaceIcon";

const scoreRows = [
  ["work", "ด้านเนื้องาน"],
  ["social", "ด้านสังคม"],
  ["mentor", "ด้านพี่เลี้ยง"],
  ["experience", "ด้านประสบการณ์"],
] as const;

export function ReviewCard({
  review,
  company,
  readMoreHref,
}: {
  review: Review;
  company?: Company;
  readMoreHref?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  return (
    <article
      onClick={(event) => {
        if (!readMoreHref) return;
        const target = event.target as HTMLElement;
        if (target.closest("a, button")) return;
        router.push(readMoreHref);
      }}
      className={`grid gap-[18px] rounded-2xl border border-zinc-200 bg-white p-5 pb-[22px] text-zinc-900 transition hover:-translate-y-0.5 hover:shadow-lift active:scale-[0.99] active:translate-y-0 ${
        readMoreHref ? "cursor-pointer" : ""
      }`}
    >
      {company && (
        <Link
          href={`/company/${company.id}`}
          className="-mb-1 flex items-center gap-2.5 text-zinc-900 no-underline"
        >
          <CompanyLogo id={company.id} size={28} />
          <span className="text-sm font-semibold">{company.name}</span>
        </Link>
      )}
      <div className="grid grid-cols-[48px_minmax(0,1fr)_auto] items-start gap-x-2 gap-y-1">
        <FaceIcon score={review.scores.experience} className="row-span-2 h-10 w-10 rounded-xl" />
        <h2 className="m-0 min-w-0 text-md font-bold leading-tight">{review.name}</h2>
        <span className="whitespace-nowrap text-right text-sm leading-tight text-zinc-500">{review.daysAgo} วันที่แล้ว</span>
        <p className="m-0 min-w-0 text-sm leading-tight text-zinc-500">
          {review.department} | Intania {review.intania}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5">
        {scoreRows.map(([key, label]) => (
          <div key={key} className="inline-flex min-w-0 items-center gap-2 text-sm font-normal leading-tight text-zinc-600">
            <FaceIcon score={review.scores[key]} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-3 pt-0.5">
        <h3 className="m-0 text-lg font-bold leading-tight">{review.position}</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl bg-zinc-50 p-3 sm:grid-cols-3">
          {[
            { icon: <ClockIcon />, text: review.duration },
            { icon: <WorkModeIcon />, text: review.workMode },
            { icon: <CoinIcon />, text: review.compensation },
            { icon: <GraduationIcon />, text: `รับ${review.openYears}` },
            review.minGpa != null ? { icon: <GpaIcon />, text: `เกรดเฉลี่ยขั้นต่ำ ${review.minGpa.toFixed(2)}` } : null,
          ]
            .filter((fact): fact is { icon: React.ReactElement; text: string } => fact !== null)
            .map((fact) => (
              <div key={fact.text} className="flex min-w-0 items-center gap-2 text-sm leading-tight text-zinc-600">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-zinc-400 ring-1 ring-zinc-200">
                  {fact.icon}
                </span>
                <span className="truncate">{fact.text}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="grid gap-[18px] border-t border-zinc-100 pt-[18px] text-sm leading-[1.35] text-zinc-700">
        <ReviewSection
          title="ขั้นตอนการสมัคร"
          icon={<ApplicationIcon />}
          text={review.sections.application}
          clamp={readMoreHref ? true : !expanded}
        />
        {expanded && !readMoreHref && (
          <div className="animate-fade-in-up grid gap-[18px]">
            <ReviewSection title="งานที่ได้รับ" icon={<WorkIcon />} text={review.sections.work} />
            <ReviewSection title="บรรยากาศการทำงาน" icon={<AtmosphereIcon />} text={review.sections.atmosphere} />
            {review.sections.welfare && (
              <ReviewSection title="สวัสดิการและการเดินทาง" icon={<WelfareIcon />} text={review.sections.welfare} />
            )}
            <ReviewSection title="สิ่งที่อยากบอกต่อ" icon={<AdviceIcon />} text={review.sections.advice} />
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
    </article>
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
