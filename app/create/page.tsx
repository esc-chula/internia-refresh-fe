import { BackLink } from "@/components/BackLink";
import { CreateReviewForm } from "@/components/CreateReviewForm";

export default function CreateReviewPage() {
  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-5">
        <BackLink href="/" label="กลับไปหน้าหลัก" />
        <CreateReviewForm />
      </div>
    </main>
  );
}
