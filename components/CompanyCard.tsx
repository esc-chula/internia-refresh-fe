import Link from "next/link";
import { Company } from "@/lib/mock-data";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreToFace } from "./FaceIcon";

const labels = [
  ["work", "ด้านเนื้องาน"],
  ["social", "ด้านสังคม"],
  ["mentor", "ด้านพี่เลี้ยง"],
  ["experience", "ด้านประสบการณ์"],
] as const;

export function CompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href="/company/line-man-wongnai"
      className="grid gap-4 rounded-3xl border border-internia-border bg-white p-5 text-black no-underline transition hover:-translate-y-0.5 hover:border-[#cfc4ba]"
    >
      <div className="grid grid-cols-[74px_minmax(0,1fr)] items-center gap-4">
        <CompanyLogo id={company.id} />
        <div className="grid min-w-0 gap-2">
          <h3 className="m-0 text-[1.02rem] font-semibold leading-tight">{company.name}</h3>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-[0.84rem] leading-tight text-[#686868]">
              {company.tag}
            </span>
            <span className="inline-flex items-center gap-2 text-[0.95rem] text-black">
              <FaceIcon score={scoreToFace(company.rating)} />
              {company.rating.toFixed(1)} ({company.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {labels.map(([key, label]) => {
          const value = company.scores[key];
          return (
            <div key={key} className="inline-flex min-w-0 items-center gap-2 text-[0.9rem] font-normal leading-tight">
              <FaceIcon score={scoreToFace(value)} />
              <span className="whitespace-nowrap">
                {value.toFixed(1)} {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[0.82rem] leading-snug text-[#585858]">รุ่นพี่ {company.recommendCount} คนแนะนำให้สมัคร</div>
    </Link>
  );
}
