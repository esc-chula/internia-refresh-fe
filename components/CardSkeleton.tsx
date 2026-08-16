export function CardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="grid animate-pulse gap-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-200" />
        <div className="grid min-w-0 flex-1 gap-2">
          <div className="h-4 w-2/3 rounded bg-zinc-200" />
          <div className="h-3 w-1/3 rounded bg-zinc-200" />
        </div>
      </div>
      <div className="h-3 w-full rounded bg-zinc-100" />
      <div className="h-3 w-4/5 rounded bg-zinc-100" />
      {tall && (
        <>
          <div className="h-16 rounded-xl bg-zinc-100" />
          <div className="h-3 w-3/5 rounded bg-zinc-100" />
        </>
      )}
    </div>
  );
}
