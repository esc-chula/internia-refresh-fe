"use client";

import { useEffect, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);

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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-full border border-zinc-300 bg-white pl-4 pr-3 text-sm text-zinc-700 outline-none transition hover:border-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-internia-primary/10 active:scale-[0.98]"
      >
        <span className={`whitespace-nowrap ${!selected && placeholder ? "text-zinc-400" : ""}`}>
          {selected?.label ?? placeholder ?? ""}
        </span>
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
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`block w-full whitespace-nowrap rounded-full px-4 py-2 text-left text-sm transition hover:bg-zinc-100 ${
                option.value === value ? "font-semibold text-internia-primary" : "text-zinc-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
