"use client";

import { useState } from "react";
import { Review } from "@/lib/mock-data";
import { FaceIcon } from "./FaceIcon";

const scoreRows = [
  ["work", "ด้านเนื้องาน"],
  ["social", "ด้านสังคม"],
  ["mentor", "ด้านพี่เลี้ยง"],
  ["experience", "ด้านประสบการณ์"],
] as const;

export function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="grid gap-[18px] rounded-[22px] border border-[#d9d9d9] bg-white p-5 pb-[22px] text-black">
      <div className="grid grid-cols-[36px_minmax(0,1fr)_auto] items-start gap-3">
        <FaceIcon score={review.scores.experience} className="h-9 w-9 rounded-lg" />
        <div className="min-w-0">
          <h2 className="m-0 text-xl font-bold leading-tight">{review.name}</h2>
          <p className="mt-0.5 text-[0.9rem] leading-tight text-[#686868]">
            {review.department} | Intania {review.intania}
          </p>
        </div>
        <div className="whitespace-nowrap pt-0.5 text-right text-[0.9rem] leading-tight text-[#686868]">
          <span>{review.daysAgo} วันที่แล้ว</span>
          <span className="mt-1 block text-[0.86rem] text-[#178c45]">{review.recommended ? "แนะนำให้สมัคร" : "ไม่แนะนำให้สมัคร"}</span>
        </div>
      </div>

      <div className="grid gap-3 pt-0.5">
        <h3 className="m-0 text-[1.05rem] font-bold leading-tight">{review.position}</h3>
        <div className="flex flex-wrap gap-2">
          {[review.duration, review.compensation, review.workMode].map((chip) => (
            <span key={chip} className="rounded-full bg-[#f5f5f5] px-[15px] py-1.5 text-[0.9rem] leading-tight text-[#686868]">
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {scoreRows.map(([key, label]) => (
          <div key={key} className="inline-flex min-w-0 items-center gap-2 text-[0.9rem] font-normal leading-tight">
            <FaceIcon score={review.scores[key]} />
            <span className="whitespace-nowrap">{label}</span>
          </div>
        ))}
      </div>

      <div className="grid gap-[18px] text-[0.9rem] leading-[1.35]">
        <ReviewSection title="ขั้นตอนการสมัคร" text={review.sections.application} clamp={!expanded} />
        {expanded && (
          <>
            <ReviewSection title="งานที่ได้รับ" text={review.sections.work} />
            <ReviewSection title="บรรยากาศการทำงาน" text={review.sections.atmosphere} />
            <ReviewSection title="สิ่งที่อยากบอกต่อ" text={review.sections.advice} />
          </>
        )}
        <button className="justify-self-center border-0 bg-transparent p-0 text-[0.95rem] font-bold text-[#686868]" type="button" onClick={() => setExpanded((value) => !value)}>
          {expanded ? "ย่อ" : "เพิ่มเติม"}
        </button>
      </div>
    </article>
  );
}

function ReviewSection({ title, text, clamp = false }: { title: string; text: string; clamp?: boolean }) {
  return (
    <section className="grid gap-2">
      <h4 className="m-0 text-[0.9rem] font-bold leading-tight">{title}</h4>
      <p className="m-0 font-normal">{clamp ? `${text.slice(0, 170)} ...` : text}</p>
    </section>
  );
}
