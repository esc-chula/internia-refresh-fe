import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { CompanyProfileCard } from "@/components/CompanyProfileCard";
import { CompanyReviewsExplore } from "@/components/CompanyReviewsExplore";
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

  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-5">
        <BackLink href="/" label="กลับไปหน้าหลัก" />
        <CompanyProfileCard company={company} />
        <Suspense>
          <CompanyReviewsExplore reviews={companyReviews} />
        </Suspense>
      </div>
    </main>
  );
}
