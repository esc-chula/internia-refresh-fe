"use client";

export type SearchBoxMode = { value: string; label: string };

export function SearchBox({
  modes,
  mode,
  onModeChange,
  value,
  onChange,
  onSubmit,
  onFocus,
  onBlur,
  placeholder,
  children,
  className = "",
  compact = false,
}: {
  modes?: SearchBoxMode[];
  mode?: string;
  onModeChange?: (value: string) => void;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder: string;
  children?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <form
        className={`flex items-center gap-4 rounded-full border border-zinc-200 bg-white shadow-lift sm:gap-2 ${compact ? "p-1.5 pl-4" : "p-1.5 pl-2"}`}
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {modes && modes.length > 0 && (
          <div className="flex shrink-0 rounded-full bg-zinc-100 p-1 text-sm">
            {modes.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => onModeChange?.(item.value)}
                className={`rounded-full px-3 py-1.5 transition ${mode === item.value ? "bg-white text-zinc-900 shadow-crisp" : "text-zinc-500"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`h-10 min-w-0 flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 ${compact ? "" : "sm:h-11 sm:text-base"}`}
          placeholder={placeholder}
        />
        <button
          type="submit"
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-internia-primary text-white transition active:scale-[0.94] hover:bg-internia-primaryDark ${compact ? "" : "sm:h-11 sm:w-11"}`}
          aria-label="ค้นหา"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>

      {children}
    </div>
  );
}
