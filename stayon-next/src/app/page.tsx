"use client";

import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PriorityBadge from "@/components/PriorityBadge";
import { useTodoStore } from "@/store/useTodoStore";
import { getTimeUntilDeadline, isUrgent, formatDeadlineFull } from "@/lib/utils";

export default function HomePage() {
  const todos = useTodoStore((s) => s.todos);
  const hydrated = useTodoStore((s) => s.hydrated);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  const total = todos.length;
  const pending = todos.filter((t) => !t.completed).length;
  const pendingTodos = todos
    .filter((t) => !t.completed)
    .sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    })
    .slice(0, 5);

  // Priority → left bar color (신호등)
  function barColor(priority: string) {
    if (priority === "High") return "bg-red-500";
    if (priority === "Medium") return "bg-amber-400";
    return "bg-green-500";
  }

  if (!hydrated) {
    return (
      <>
        <Header title="" showLogo />
        <main className="max-w-[480px] mx-auto px-6 space-y-8 pt-4">
          <section className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl h-28 animate-pulse" />
            <div className="bg-primary-container p-5 rounded-xl h-28 animate-pulse" />
          </section>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-5 h-20 animate-pulse" />
            ))}
          </div>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header title="" showLogo />
      <main className="max-w-[480px] mx-auto px-6 space-y-8 pt-4">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col justify-between h-28 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <span className="text-on-surface-variant font-medium text-sm">전체 할일</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-primary font-headline">{total}</span>
              <span className="text-on-surface-variant text-xs">건</span>
            </div>
          </div>
          <div className="bg-primary-container p-5 rounded-xl flex flex-col justify-between h-28 shadow-[0_8px_24px_rgba(85,124,85,0.15)]">
            <span className="text-on-primary-container font-medium text-sm">오늘의 할 일</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white font-headline">{pending}</span>
              <span className="text-on-primary-container text-xs">건 남음</span>
            </div>
          </div>
        </section>

        {/* In Progress Tasks */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface tracking-tight font-headline">
              진행 중인 작업
            </h2>
            <Link href="/todos" className="text-primary font-semibold text-sm">
              모두 보기
            </Link>
          </div>

          {pendingTodos.length === 0 ? (
            <div className="bg-surface-container-low rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-outline-variant mb-2 block">
                task_alt
              </span>
              <p className="text-on-surface-variant text-sm">진행 중인 할 일이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-surface-container-lowest rounded-xl p-5 relative overflow-hidden flex items-center gap-4 group active:scale-95 transition-transform duration-200"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor(todo.priority)}`} />
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="w-10 h-10 rounded-full border-2 border-outline flex items-center justify-center shrink-0 hover:border-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-outline">
                      radio_button_unchecked
                    </span>
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <PriorityBadge priority={todo.priority} />
                      {isUrgent(todo.deadline) && (
                        <span className="text-xs text-on-surface-variant">
                          {formatDeadlineFull(todo.deadline)} 까지
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-on-surface truncate">{todo.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FAB */}
      <Link
        href="/todos/new"
        className="fixed bottom-32 right-8 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>

      <BottomNav />
    </>
  );
}
