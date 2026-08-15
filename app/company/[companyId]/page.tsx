import { Suspense } from "react";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { CompanyProfileCard } from "@/components/CompanyProfileCard";
import { CompanyReviewsExplore } from "@/components/CompanyReviewsExplore";
import type { Company, ReviewListResponse } from "@/lib/api/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

type CompanyPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { companyId: slug } = await params;

  const companyRes = await fetch(`${API_BASE}/companies/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60 },
  });
  if (companyRes.status === 404) notFound();
  if (!companyRes.ok) throw new Error(`Failed to load company: ${companyRes.status}`);
  const company: Company = await companyRes.json();

  const reviewsRes = await fetch(`${API_BASE}/companies/${encodeURIComponent(slug)}/reviews?limit=100`, {
    next: { revalidate: 60 },
  });
  if (!reviewsRes.ok) throw new Error(`Failed to load reviews: ${reviewsRes.status}`);
  const reviewsData: ReviewListResponse = await reviewsRes.json();

  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-5">
        <BackLink href="/" label="กลับไปหน้าหลัก" />
        <CompanyProfileCard company={company} />
        <Suspense>
          <CompanyReviewsExplore reviews={reviewsData.reviews} />
        </Suspense>
      </div>
    </main>
  );
}
