"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

type Toast = { id: number; message: string; variant: "success" | "error" };
type ConfirmState = { message: string; confirmLabel: string; cancelLabel: string; resolve: (value: boolean) => void };

type NotificationContextValue = {
  showToast: (message: string, variant?: "success" | "error") => void;
  confirm: (message: string, options?: { confirmLabel?: string; cancelLabel?: string }) => Promise<boolean>;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);
  const nextId = useRef(0);

  const showToast = useCallback((message: string, variant: "success" | "error" = "success") => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { id, message, variant }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3200);
  }, []);

  const confirm = useCallback(
    (message: string, options?: { confirmLabel?: string; cancelLabel?: string }) =>
      new Promise<boolean>((resolve) => {
        setConfirmState({
          message,
          confirmLabel: options?.confirmLabel ?? "ยืนยัน",
          cancelLabel: options?.cancelLabel ?? "ยกเลิก",
          resolve,
        });
      }),
    [],
  );

  function resolveConfirm(result: boolean) {
    confirmState?.resolve(result);
    setConfirmState(null);
  }

  return (
    <NotificationContext.Provider value={{ showToast, confirm }}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] grid justify-items-center gap-2 px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-fade-in-up pointer-events-auto flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-lift"
          >
            {toast.variant === "error" ? (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-internia-primary text-white">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </span>
            ) : (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-green-600 text-white">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
            {toast.message}
          </div>
        ))}
      </div>

      {confirmState && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4"
          onClick={() => resolveConfirm(false)}
        >
          <div
            className="animate-fade-in-up grid w-full max-w-sm gap-4 rounded-2xl bg-white p-6 shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="m-0 text-sm leading-relaxed text-zinc-700">{confirmState.message}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => resolveConfirm(false)}
                className="min-h-10 rounded-full border border-zinc-300 bg-white text-sm font-semibold text-zinc-700 transition active:scale-[0.98] hover:border-zinc-400"
              >
                {confirmState.cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => resolveConfirm(true)}
                className="min-h-10 rounded-full bg-internia-primary text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-internia-primaryDark"
              >
                {confirmState.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

function useNotificationContext() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useToast/useConfirm must be used within NotificationProvider");
  return ctx;
}

export function useToast() {
  return useNotificationContext().showToast;
}

export function useConfirm() {
  return useNotificationContext().confirm;
}
