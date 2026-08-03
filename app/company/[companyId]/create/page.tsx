import { BackLink } from "@/components/BackLink";
import { CreateReviewForm } from "@/components/CreateReviewForm";

export default async function CreateReviewPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;

  return (
    <>
      <div className="mx-auto w-[min(100%-32px,1120px)] pt-5">
        <BackLink href={`/company/${companyId}`} label="กลับไปหน้าบริษัท" />
      </div>
      <CreateReviewForm />
    </>
  );
}
