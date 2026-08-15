"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { CreateReviewForm } from "@/components/CreateReviewForm";
import { getCompany } from "@/lib/api/companies";
import { getReview } from "@/lib/api/reviews";
import type { Company, Review } from "@/lib/api/types";

export default function EditReviewPage() {
  const params = useParams<{ reviewId: string }>();
  const router = useRouter();
  const [review, setReview] = useState<Review | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getReview(params.reviewId)
      .then(async (fetchedReview) => {
        if (cancelled) return;
        if (!fetchedReview.canEdit) {
          setError("คุณไม่มีสิทธิ์แก้ไขรีวิวนี้");
          return;
        }
        setReview(fetchedReview);
        try {
          const fetchedCompany = await getCompany(fetchedReview.companySlug);
          if (!cancelled) setCompany(fetchedCompany);
        } catch {
          // Company lookup is only for display (name/logo) — the edit
          // form still works with just the slug if this fails.
        }
      })
      .catch(() => {
        if (!cancelled) setError("ไม่พบรีวิวที่ต้องการแก้ไข");
      });

    return () => {
      cancelled = true;
    };
  }, [params.reviewId, router]);

  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-5">
        <BackLink href="/" label="กลับไปหน้าหลัก" />

        {error && <p className="text-center text-sm text-internia-primary">{error}</p>}

        {!error && review && (
          <CreateReviewForm
            mode="edit"
            reviewId={review.id}
            initialReview={review}
            fixedCompanySlug={review.companySlug}
            fixedCompanyName={company?.name ?? review.companySlug}
          />
        )}

        {!error && !review && <p className="text-center text-sm text-zinc-400">กำลังโหลด...</p>}
      </div>
    </main>
  );
}
