import { notFound } from "next/navigation";
import Link from "next/link";
import { BackLink } from "@/components/BackLink";
import { CompanyCard } from "@/components/CompanyCard";
import { ReviewCard } from "@/components/ReviewCard";
import { companies, reviews } from "@/lib/mock-data";

type CompanyPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function generateStaticParams() {
  return companies.map((company) => ({ companyId: company.id }));
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { companyId } = await params;
  const company = companies.find((item) => item.id === companyId);
  if (!company) notFound();

  const companyReviews = reviews.filter((review) => review.companyId === company.id);

  if (company.id === "line-man-wongnai") {
    return <LineManWongnaiPage company={company} companyReviews={companyReviews} />;
  }

  return (
    <main className="mx-auto w-[min(100%-20px,760px)] py-5 md:py-7">
      <div className="grid gap-[18px]">
        <BackLink href="/" label="กลับไปหน้าหลัก" />
        <CompanyCard company={company} />
        <section className="grid gap-3.5">
          {companyReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </section>
      </div>
    </main>
  );
}

function LineManWongnaiPage({
  company,
  companyReviews,
}: {
  company: (typeof companies)[number];
  companyReviews: typeof reviews;
}) {
  return (
    <main className="mx-auto w-[min(100%-20px,960px)] py-5 md:py-8">
      <div className="grid gap-5">
        <BackLink href="/" label="กลับไปหน้าหลัก" />
        <CompanyCard company={company} />

        <section className="grid gap-3.5">
          <div className="flex items-start justify-between gap-3 px-1">
            <div>
              <h2 className="m-0 text-[1.15rem] font-bold leading-tight">รีวิวล่าสุด</h2>
              <p className="m-0 mt-1 text-sm text-[#686868]">กดอ่านเพิ่มเติมเพื่อดูรายละเอียด</p>
            </div>
            <Link
              href={`/company/${company.id}/create`}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#821923] px-5 text-sm font-bold text-white no-underline"
            >
              เขียนรีวิว
            </Link>
          </div>
          {companyReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </section>
      </div>
    </main>
  );
}
