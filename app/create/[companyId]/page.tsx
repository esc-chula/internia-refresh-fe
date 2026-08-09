import { notFound } from "next/navigation";
import { BackLink } from "@/components/BackLink";
import { CreateReviewForm } from "@/components/CreateReviewForm";
import { companies } from "@/lib/mock-data";

type CreateReviewPageProps = {
  params: Promise<{
    companyId: string;
  }>;
};

export async function generateStaticParams() {
  return companies.map((company) => ({ companyId: company.id }));
}

export default async function CreateReviewPage({ params }: CreateReviewPageProps) {
  const { companyId } = await params;
  const company = companies.find((item) => item.id === companyId);
  if (!company) notFound();

  return (
    <main className="mx-auto w-[min(100%-20px,960px)] py-5 md:py-8">
      <div className="grid gap-5">
        <BackLink href={`/company/${company.id}`} label="กลับไปหน้าบริษัท" />
        <CreateReviewForm />
      </div>
    </main>
  );
}
