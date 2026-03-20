"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import ConfirmDialog, { useToast } from "@/components/ConfirmDialog";
import { useTodoStore } from "@/store/useTodoStore";
import { todosToCSV } from "@/lib/utils";

export default function SettingsPage() {
  const router = useRouter();
  const todos = useTodoStore((s) => s.todos);
  const clearAll = useTodoStore((s) => s.clearAll);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { showToast, ToastComponent } = useToast();

  function handleExport() {
    const csv = todosToCSV(todos);
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "todos.csv";
    link.click();
    URL.revokeObjectURL(url);
    showToast("CSV 파일이 다운로드되었습니다");
  }

  function handleClearAll() {
    clearAll();
    showToast("모든 데이터가 삭제되었습니다");
    setShowClearConfirm(false);
    setTimeout(() => router.push("/"), 500);
  }

  return (
    <>
      {ToastComponent}
      <ConfirmDialog
        open={showClearConfirm}
        title="모든 데이터 삭제"
        message="모든 할 일 데이터가 삭제됩니다. 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleClearAll}
        onCancel={() => setShowClearConfirm(false)}
      />

      <Header title="설정" showBack />

      <main className="max-w-[480px] mx-auto px-6 mt-4 flex-1 pb-32">
        {/* Data & Info Section */}
        <section>
          <div className="mb-4">
            <p className="text-on-secondary-container text-sm font-medium tracking-wide mb-1">
              StayOn 앱 관리
            </p>
            <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tighter">
              데이터 및 정보
            </h2>
          </div>
          <div className="space-y-4">
            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between transition-colors active:bg-surface-container-high group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary group-active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">file_export</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">데이터 내보내기</p>
                  <p className="text-sm text-on-surface-variant">기록을 CSV 파일로 저장합니다</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </button>

            {/* App Info */}
            <div className="bg-surface-container-lowest rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">info</span>
                </div>
                <div>
                  <p className="font-semibold text-on-surface">앱 정보</p>
                  <p className="text-sm text-on-surface-variant">StayOn v2.0 (Next.js)</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </div>

            <div className="h-2" />

            {/* Clear All */}
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full bg-surface-container-low rounded-xl p-5 flex items-center justify-between transition-colors active:bg-error-container group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-tertiary-container/10 rounded-full flex items-center justify-center text-tertiary group-active:scale-95 transition-transform">
                  <span className="material-symbols-outlined">delete_forever</span>
                </div>
                <div>
                  <p className="font-semibold text-tertiary">모든 데이터 삭제</p>
                  <p className="text-sm text-on-tertiary-fixed-variant">이 작업은 되돌릴 수 없습니다</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-tertiary/40">warning</span>
            </button>
          </div>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
