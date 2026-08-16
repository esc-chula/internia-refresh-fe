import { CardSkeleton } from "@/components/CardSkeleton";

export default function Loading() {
  return (
    <main className="mx-auto w-[min(100%-40px,960px)] pt-5 pb-12 md:pt-8 md:pb-16">
      <div className="grid gap-5">
        <div className="h-5 w-24 animate-pulse rounded bg-zinc-200" />

        <div className="animate-pulse overflow-hidden rounded-3xl border border-zinc-200 bg-white">
          <div className="grid gap-4 border-b border-zinc-100 bg-zinc-100 p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center md:p-8">
            <div className="h-[88px] w-[88px] rounded-2xl bg-zinc-200" />
            <div className="grid gap-2">
              <div className="h-7 w-1/2 rounded bg-zinc-200" />
              <div className="h-4 w-1/3 rounded bg-zinc-200" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 p-6 sm:grid-cols-4 md:p-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="grid justify-items-center gap-2">
                <div className="h-5 w-10 rounded bg-zinc-200" />
                <div className="h-3 w-16 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          <CardSkeleton tall />
          <CardSkeleton tall />
        </div>
      </div>
    </main>
  );
}
