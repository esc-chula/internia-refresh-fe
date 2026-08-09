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
      className={`grid gap-[18px] rounded-2xl border border-zinc-200 bg-white p-5 pb-[22px] text-zinc-900 transition hover:shadow-lift ${
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

      <div className="grid gap-3 pt-0.5">
        <h3 className="m-0 text-lg font-bold leading-tight">{review.position}</h3>
        <div className="flex flex-wrap gap-2">
          {[
            review.duration,
            review.compensation,
            review.workMode,
            `รับ${review.openYears}`,
            review.minGpa != null ? `เกรดเฉลี่ยขั้นต่ำ ${review.minGpa.toFixed(2)}` : null,
          ]
            .filter((chip): chip is string => Boolean(chip))
            .map((chip) => (
              <span key={chip} className="rounded-full bg-zinc-100 px-[15px] py-1.5 text-sm leading-tight text-zinc-600">
                {chip}
              </span>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5">
        {scoreRows.map(([key, label]) => (
          <div key={key} className="inline-flex min-w-0 items-center gap-2 text-sm font-normal leading-tight text-zinc-600">
            <FaceIcon score={review.scores[key]} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
        <div
          className={`col-span-2 text-center text-sm font-semibold leading-tight sm:col-span-1 sm:text-left ${
            review.recommended ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {review.recommended ? "แนะนำให้สมัคร" : "ไม่แนะนำให้สมัคร"}
        </div>
      </div>

      <div className="grid gap-[18px] border-t border-zinc-100 pt-[18px] text-sm leading-[1.35] text-zinc-700">
        <ReviewSection title="ขั้นตอนการสมัคร" text={review.sections.application} clamp={readMoreHref ? true : !expanded} />
        {expanded && !readMoreHref && (
          <>
            <ReviewSection title="งานที่ได้รับ" text={review.sections.work} />
            <ReviewSection title="บรรยากาศการทำงาน" text={review.sections.atmosphere} />
            {review.sections.welfare && <ReviewSection title="สวัสดิการและการเดินทาง" text={review.sections.welfare} />}
            <ReviewSection title="สิ่งที่อยากบอกต่อ" text={review.sections.advice} />
          </>
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

function ReviewSection({ title, text, clamp = false }: { title: string; text: string; clamp?: boolean }) {
  return (
    <section className="grid gap-2">
      <h4 className="m-0 text-sm font-bold leading-tight text-zinc-900">{title}</h4>
      <p className="m-0 font-normal">{clamp ? `${text.slice(0, 170)} ...` : text}</p>
    </section>
  );
}
