import Link from "next/link";

export function BackLink({ href = "/", label = "ย้อนกลับ" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d6d3d1] bg-white px-4 py-2 text-[0.9rem] font-medium text-[#44403c] no-underline transition hover:border-[#c7c2bc] hover:text-[#111111]"
    >
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </Link>
  );
}
