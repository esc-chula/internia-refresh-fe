"use client";

import { useEffect, useRef, useState } from "react";
import type { SelectOption } from "./CustomSelect";

export function MultiSelect({
  values,
  onChange,
  options,
  placeholder,
}: {
  values: string[];
  onChange: (values: string[]) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.filter((option) => values.includes(option.value));

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function toggle(value: string) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
    } else {
      onChange([...values, value]);
    }
  }

  const label =
    selected.length === 0
      ? (placeholder ?? "")
      : selected.length === 1
        ? selected[0].label
        : `${selected[0].label} +${selected.length - 1}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-full border bg-white pl-4 pr-3 text-sm outline-none transition active:scale-[0.98] hover:border-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10 ${
          selected.length > 0 ? "border-internia-primary text-internia-primary" : "border-zinc-300 text-zinc-700"
        }`}
      >
        <span className={`whitespace-nowrap ${selected.length === 0 && placeholder ? "text-zinc-400" : ""}`}>{label}</span>
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`shrink-0 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="animate-dropdown-in absolute left-0 top-[calc(100%+8px)] z-20 max-h-72 min-w-full overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-lift">
          {options.map((option) => {
            const checked = values.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => toggle(option.value)}
                className="flex w-full items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2 text-left text-sm text-zinc-700 transition hover:bg-zinc-100"
              >
                <span
                  className={`grid h-[16px] w-[16px] shrink-0 place-items-center rounded-[5px] border-2 ${
                    checked ? "border-internia-primary bg-internia-primary" : "border-zinc-300"
                  }`}
                >
                  {checked && (
                    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className={checked ? "font-semibold text-internia-primary" : ""}>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
