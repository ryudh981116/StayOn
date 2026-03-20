"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import ConfirmDialog, { useToast } from "@/components/ConfirmDialog";
import { useTodoStore } from "@/store/useTodoStore";

export default function EditTodoPage() {
  const router = useRouter();
  const params = useParams();
  const todoId = Number(params.id);

  const getTodoById = useTodoStore((s) => s.getTodoById);
  const updateTodo = useTodoStore((s) => s.updateTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const hydrated = useTodoStore((s) => s.hydrated);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    if (!hydrated) return;
    const todo = getTodoById(todoId);
    if (!todo) {
      showToast("할 일을 찾을 수 없습니다", "error");
      router.push("/todos");
      return;
    }
    const dl = new Date(todo.deadline);
    setTitle(todo.title);
    setDescription(todo.description);
    setDate(dl.toISOString().slice(0, 10));
    setTime(`${String(dl.getHours()).padStart(2, "0")}:${String(dl.getMinutes()).padStart(2, "0")}`);
    setPriority(todo.priority);
    setLoaded(true);
  }, [hydrated, todoId, getTodoById, router, showToast]);

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
    updateTodo(todoId, { title: title.trim(), description, deadline, priority });
    showToast("할 일이 수정되었습니다");
    setTimeout(() => router.push("/todos"), 500);
  }

  function handleDelete() {
    deleteTodo(todoId);
    showToast("삭제되었습니다");
    setShowDeleteConfirm(false);
    setTimeout(() => router.push("/todos"), 500);
  }

  const priorities: { value: "Low" | "Medium" | "High"; label: string }[] = [
    { value: "Low", label: "낮음" },
    { value: "Medium", label: "보통" },
    { value: "High", label: "높음" },
  ];

  if (!loaded) {
    return (
      <>
        <Header title="할 일 수정" showBack />
        <main className="w-full max-w-[480px] mx-auto px-6 pt-4">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-container-high rounded-xl h-14 animate-pulse" />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {ToastComponent}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="할 일 삭제"
        message="이 할 일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <Header title="할 일 수정" showBack />
      <main className="w-full max-w-[480px] mx-auto px-6 pt-4 pb-12">
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="space-y-3">
            <label className="font-headline font-bold text-on-surface-variant text-sm tracking-wide px-1">
              작업 제목
            </label>
            <div
              className={`bg-surface-container-high rounded-xl px-4 py-4 transition-colors focus-within:bg-surface-container-highest ${
                errors.title ? "ring-2 ring-error/50" : ""
              }`}
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium placeholder-outline p-0"
                placeholder="무엇을 해야 하나요?"
                maxLength={100}
                disabled={submitting}
              />
            </div>
            {errors.title && <p className="text-error text-xs ml-1">{errors.title}</p>}
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="font-headline font-bold text-on-surface-variant text-sm tracking-wide px-1">
                마감 기한
              </label>
              <div
                className={`bg-surface-container-low rounded-xl px-4 py-3 flex items-center space-x-3 ${
                  errors.deadline ? "ring-2 ring-error/50" : ""
                }`}
              >
                <span className="material-symbols-outlined text-primary text-xl">calendar_today</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm w-full focus:ring-0"
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="font-headline font-bold text-on-surface-variant text-sm tracking-wide px-1">
                마감 시간
              </label>
              <div className="bg-surface-container-low rounded-xl px-4 py-3 flex items-center space-x-3">
                <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm w-full focus:ring-0"
                  disabled={submitting}
                />
              </div>
            </div>
          </div>
          {errors.deadline && <p className="text-error text-xs ml-1 -mt-6">{errors.deadline}</p>}

          {/* Priority */}
          <div className="space-y-3">
            <label className="font-headline font-bold text-on-surface-variant text-sm tracking-wide px-1">
              우선 순위
            </label>
            <div className="flex gap-3">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  disabled={submitting}
                  className={`flex-1 py-3 rounded-xl text-sm active:scale-95 transition-all ${
                    priority === p.value
                      ? p.value === "High"
                        ? "bg-tertiary-container text-white font-bold shadow-sm"
                        : p.value === "Medium"
                        ? "bg-primary-container text-white font-bold shadow-sm"
                        : "bg-primary-fixed text-on-primary-fixed-variant font-bold shadow-sm"
                      : "bg-surface-container-lowest text-on-surface-variant border border-outline-variant/30 font-medium"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="font-headline font-bold text-on-surface-variant text-sm tracking-wide px-1">
              상세 내용
            </label>
            <div className="bg-surface-container-low rounded-xl px-4 py-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm p-0 resize-none"
                placeholder="추가 세부 정보를 입력하세요."
                rows={4}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-lg shadow-[0_12px_24px_rgba(61,99,62,0.2)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  저장 중...
                </span>
              ) : (
                "변경 사항 저장"
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 flex items-center justify-center gap-2 text-tertiary font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
              이 할 일 삭제하기
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
