"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomSelect } from "@/components/CustomSelect";
import { onboard } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/types";
import { setOnboarded } from "@/lib/auth-storage";
import { departments } from "@/lib/departments";

const departmentOptions = departments.map((department) => ({ value: department, label: department }));

export default function OnboardingPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [department, setDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setUsernameError(null);
    setFormError(null);

    if (!username.trim()) {
      setUsernameError("กรุณากรอกชื่อผู้ใช้");
      return;
    }
    if (!department) {
      setFormError("กรุณาเลือกภาควิชา");
      return;
    }

    setSubmitting(true);
    try {
      await onboard(username.trim(), department);
      setOnboarded(true);
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError && err.fields?.username) {
        setUsernameError("ชื่อผู้ใช้นี้ถูกใช้แล้ว");
      } else {
        setFormError("บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-64px)] w-[min(100%-40px,480px)] place-items-center">
      <form
        onSubmit={handleSubmit}
        className="grid w-full gap-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-lift"
      >
        <div className="grid gap-2 text-center">
          <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-zinc-900">ตั้งค่าโปรไฟล์</h1>
          <p className="m-0 text-sm text-zinc-500">กรอกข้อมูลก่อนเริ่มใช้งาน Internia</p>
        </div>

        <label className="grid grid-cols-1 gap-2">
          <span className="text-sm font-medium leading-[1.4] text-zinc-700">
            ชื่อผู้ใช้ <span className="text-internia-primary">*</span>
          </span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="เช่น pim"
            maxLength={32}
            className="h-11 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10"
          />
          {usernameError && <span className="text-sm text-internia-primary">{usernameError}</span>}
        </label>

        <label className="grid grid-cols-1 gap-2">
          <span className="text-sm font-medium leading-[1.4] text-zinc-700">
            ภาควิชา <span className="text-internia-primary">*</span>
          </span>
          <CustomSelect value={department} onChange={setDepartment} placeholder="เลือกภาควิชา" options={departmentOptions} />
        </label>

        {formError && <p className="m-0 text-sm text-internia-primary">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 rounded-full bg-internia-primary text-sm font-semibold text-white shadow-crisp transition active:scale-[0.98] hover:bg-internia-primaryDark disabled:opacity-60"
        >
          {submitting ? "กำลังบันทึก..." : "เริ่มใช้งาน"}
        </button>
      </form>
    </main>
  );
}
