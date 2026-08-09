import Link from "next/link";
import { Company } from "@/lib/mock-data";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreTextClass, scoreToFace } from "./FaceIcon";
import { HeroBackground } from "./HeroBackground";

const scoreRows = [
  ["work", "ด้านเนื้องาน"],
  ["social", "ด้านสังคม"],
  ["mentor", "ด้านพี่เลี้ยง"],
  ["experience", "ด้านประสบการณ์"],
] as const;

export function CompanyProfileCard({ company }: { company: Company }) {
  const recommendPct = Math.round((company.recommendCount / company.reviewCount) * 100);
  const recommendFace = scoreToFace(recommendPct / 20);

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <div className="relative grid gap-4 overflow-hidden border-b border-zinc-100 bg-zinc-50 p-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center md:p-8">
        <HeroBackground />

        <div className="relative z-10">
          <CompanyLogo id={company.id} size={88} />
        </div>

        <div className="relative z-10 grid min-w-0 gap-1.5">
          <h1 className="m-0 text-2xl font-extrabold tracking-[-0.01em] text-zinc-900 md:text-3xl">{company.name}</h1>

          <div className="flex flex-wrap items-center gap-2.5 text-sm text-zinc-500">
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-zinc-500">{company.tag}</span>
            <span className="inline-flex items-center gap-1.5">
              <FaceIcon score={scoreToFace(company.rating)} className="h-4 w-4 shrink-0 rounded-[5px]" />
              <span className="text-base font-extrabold text-zinc-900">{company.rating.toFixed(1)}</span> / 5 คะแนนเฉลี่ย
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500">
            <span>{company.reviewCount} รีวิว</span>
            <span>
              <span className={`font-semibold ${scoreTextClass[recommendFace]}`}>{recommendPct}%</span> แนะนำให้สมัคร
            </span>
          </div>
        </div>

        <Link
          href={`/create/${company.id}`}
          className="relative z-10 inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-internia-primary px-6 text-sm font-semibold text-white no-underline shadow-crisp transition hover:bg-internia-primaryDark"
        >
          เขียนรีวิว
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-4 md:p-8">
        {scoreRows.map(([key, label]) => {
          const value = company.scores[key];
          return (
            <div key={key} className="grid justify-items-center gap-1.5 text-center">
              <span className="inline-flex items-center gap-1.5">
                <FaceIcon score={scoreToFace(value)} className="h-5 w-5 shrink-0 rounded-[6px]" />
                <span className="font-semibold text-zinc-900">{value.toFixed(1)}</span>
              </span>
              <span className="text-xs text-zinc-500">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
