"use client";

import { useState, useCallback } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-surface-container-lowest rounded-xl p-6 mx-6 max-w-sm w-full shadow-2xl">
        <h3 className="font-headline font-bold text-lg text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-surface-container-low text-on-surface-variant font-medium text-sm active:scale-95 transition-all"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-tertiary-container text-on-tertiary-container font-bold text-sm active:scale-95 transition-all"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast hook
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const ToastComponent = toast ? (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
        toast.type === "success"
          ? "bg-primary-container text-on-primary-container"
          : "bg-error-container text-on-error-container"
      }`}
    >
      {toast.message}
    </div>
  ) : null;

  return { showToast, ToastComponent };
}
