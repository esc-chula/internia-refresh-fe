import { Company } from "@/lib/mock-data";
import { CompanyLogo } from "./CompanyLogo";
import { FaceIcon, scoreToFace } from "./FaceIcon";
import { HeroBackground } from "./HeroBackground";

const scoreRows = [
  ["work", "ด้านเนื้องาน"],
  ["social", "ด้านสังคม"],
  ["mentor", "ด้านพี่เลี้ยง"],
  ["experience", "ด้านประสบการณ์"],
] as const;

export function CompanyProfileCard({ company }: { company: Company }) {
  return (
    <section className="animate-fade-in-up overflow-hidden rounded-3xl border border-zinc-200 bg-white">
      <div className="relative grid gap-4 overflow-hidden border-b border-zinc-100 bg-zinc-100 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center md:p-8">
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
              <span className="text-base font-extrabold text-zinc-900">{company.rating.toFixed(1)}</span> / 5 (จาก {company.reviewCount} รีวิว)
            </span>
          </div>
        </div>
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
              <span className="text-sm text-zinc-500">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
