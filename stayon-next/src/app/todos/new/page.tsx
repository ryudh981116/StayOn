"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useToast } from "@/components/ConfirmDialog";
import { useTodoStore } from "@/store/useTodoStore";

export default function NewTodoPage() {
  const router = useRouter();
  const addTodo = useTodoStore((s) => s.addTodo);
  const { showToast, ToastComponent } = useToast();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);
  const now = new Date();
  const defaultTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "제목을 입력해주세요";
    const deadline = new Date(`${date}T${time}`);
    if (deadline <= new Date()) errs.deadline = "마감은 미래 시간으로 설정해주세요";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const deadline = new Date(`${date}T${time}`).toISOString();
    addTodo({ title: title.trim(), description, deadline, priority });
    showToast("할 일이 추가되었습니다");
    setTimeout(() => router.push("/"), 500);
  }

  const priorities: { value: "Low" | "Medium" | "High"; label: string }[] = [
    { value: "Low", label: "낮음" },
    { value: "Medium", label: "보통" },
    { value: "High", label: "높음" },
  ];

  return (
    <>
      {ToastComponent}
      <Header title="새 할 일 추가" showBack />
      <main className="w-full max-w-[480px] mx-auto px-6 pt-4 pb-12 flex-grow overflow-y-auto">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Title */}
          <section className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant ml-1">
              할 일 제목
            </label>
            <div
              className={`bg-surface-container-high rounded-xl p-1 transition-all focus-within:bg-surface-bright ${
                errors.title ? "ring-2 ring-error/50" : ""
              }`}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 py-3 px-4 text-on-surface placeholder:text-outline font-medium"
                placeholder="어떤 일을 완료해야 하나요?"
                maxLength={100}
                disabled={submitting}
              />
            </div>
            {errors.title && <p className="text-error text-xs ml-1">{errors.title}</p>}
          </section>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <section className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1">
                마감 기한
              </label>
              <div
                className={`bg-surface-container-low rounded-xl px-4 py-3 flex items-center space-x-3 overflow-hidden ${
                  errors.deadline ? "ring-2 ring-error/50" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm w-full min-w-0 focus:ring-0"
                  disabled={submitting}
                />
              </div>
            </section>
            <section className="space-y-2">
              <label className="block text-sm font-semibold text-on-surface-variant ml-1">
                마감 시간
              </label>
              <div className="bg-surface-container-low rounded-xl px-4 py-3 flex items-center space-x-3 overflow-hidden">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm w-full min-w-0 focus:ring-0"
                  disabled={submitting}
                />
              </div>
            </section>
          </div>
          {errors.deadline && <p className="text-error text-xs ml-1 -mt-6">{errors.deadline}</p>}

          {/* Priority */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold text-on-surface-variant ml-1">
              우선 순위
            </label>
            <div className="flex gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  disabled={submitting}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium active:scale-95 transition-all ${
                    priority === p.value
                      ? p.value === "High"
                        ? "bg-red-500 text-white font-bold shadow-sm"
                        : p.value === "Medium"
                        ? "bg-amber-400 text-white font-bold shadow-sm"
                        : "bg-green-500 text-white font-bold shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface-variant ml-1">
              상세 내용
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-low rounded-xl border-none p-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="메모가 필요하신가요?"
              rows={4}
              disabled={submitting}
            />
          </section>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-lg shadow-primary/10 active:scale-95 transition-transform disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  추가 중...
                </span>
              ) : (
                "할 일 추가"
              )}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
