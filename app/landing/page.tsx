import Link from "next/link";
import { HeroBackground } from "@/components/HeroBackground";

export default function LandingPage() {
  return (
    <main>
      <section className="relative grid grid-cols-1 justify-items-center gap-5 border-b border-zinc-200 bg-zinc-100 px-4 py-20 text-center sm:px-6 md:gap-6 md:py-32">
        <HeroBackground />
        <h1 className="relative z-10 m-0 text-[clamp(1.9rem,7vw,3.6rem)] font-extrabold leading-[1.15] tracking-[-0.03em] text-zinc-900 md:leading-[1.05]">
          รีวิวฝึกงานที่จริงใจจาก<br className="sm:hidden" />ชาววิศวฯ จุฬาฯ
        </h1>
        <p className="relative z-10 m-0 max-w-[560px] text-lg leading-relaxed text-zinc-500 md:text-[1.1rem]">
          อ่านรีวิวฝึกงานจากรุ่นพี่ วิศวฯ จุฬาฯ ก่อนตัดสินใจสมัคร และร่วมแชร์ประสบการณ์ของคุณให้รุ่นน้อง
        </p>
        <Link
          href="/login"
          className="relative z-10 inline-flex h-12 items-center rounded-full bg-internia-primary px-8 text-sm font-semibold text-white no-underline shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark"
        >
          เริ่มต้นใช้งาน
        </Link>
      </section>
    </main>
  );
}
