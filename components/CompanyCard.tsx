import Link from "next/link";
import type { Company } from "@/lib/api/types";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreTextClass, scoreToFace } from "./FaceIcon";

const labels = [
  ["work", "เนื้องาน"],
  ["social", "สังคม"],
  ["mentor", "พี่เลี้ยง"],
  ["experience", "ประสบการณ์"],
] as const;

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/company/${company.slug}`}
      className="group grid min-w-0 gap-2 rounded-2xl border border-zinc-200 bg-white p-5 text-zinc-900 no-underline transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-lift active:scale-[0.99] active:translate-y-0"
    >
      <div className="grid grid-cols-[54px_minmax(0,1fr)] items-center gap-4">
        <CompanyLogo logoUrl={company.logoUrl} alt={company.name} size={54} />
        <div className="grid min-w-0 gap-2">
          <h3 className="m-0 text-base font-semibold leading-tight transition group-hover:text-black">{company.name}</h3>
          <div className="flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm leading-tight text-zinc-500">
              {company.category}
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-zinc-900">
              <FaceIcon score={scoreToFace(company.rating)} />
              {company.rating.toFixed(1)} ({company.reviewCount})
            </span>
          </div>
        </div>
      </div>
      <div className="mt-1 grid grid-cols-4 border-t border-zinc-100 pt-5">
        {labels.map(([key, label]) => {
          const value = company.scores[key];
          const face = scoreToFace(value);
          return (
            <div key={key} className="grid justify-items-center gap-2 text-center">
              <span className={`text-sm font-normal leading-none ${scoreTextClass[face]}`}>
                {value.toFixed(1)}
              </span>
              <span className="text-sm leading-none text-zinc-400">{label}</span>
            </div>
          );
        })}
      </div>
    </Link>
  );
}
