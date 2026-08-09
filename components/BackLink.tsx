import Link from "next/link";

export function BackLink({ href = "/", label = "ย้อนกลับ" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 no-underline shadow-crisp transition hover:border-zinc-300 hover:text-zinc-900"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
