import { CompanyCard } from "@/components/CompanyCard";
import { companies } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main className="mx-auto w-[min(100%-24px,1120px)] py-12 md:py-16">
      <div className="grid gap-8">
        <section className="grid justify-items-center gap-4 text-center">
          <h1 className="m-0 text-[clamp(2.8rem,5vw,4.2rem)] font-extrabold leading-none tracking-[-0.04em]">Internia</h1>
          <p className="m-0 max-w-[620px] text-[1.08rem] leading-relaxed text-[#667085]">ดูรีวิวฝึกงานที่จริงใจชาววิศวะ จุฬา จากรุ่นสู่รุ่น</p>
          <div className="grid w-[min(100%,760px)] grid-cols-1 gap-2.5 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input className="h-[58px] rounded-full border border-internia-border bg-white px-5 text-base outline-none" placeholder="ค้นหาบริษัท..." />
            <button className="h-[58px] rounded-full border-0 bg-internia-primary px-6 text-base font-bold text-white" type="button">
              ค้นหา
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-[18px] md:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </section>
      </div>
    </main>
  );
}
