"use client";

import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import { useTodoStore } from "@/store/useTodoStore";
import { isOverdue, formatDeadlineFull } from "@/lib/utils";

export default function StatsPage() {
  const todos = useTodoStore((s) => s.todos);
  const hydrated = useTodoStore((s) => s.hydrated);

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = todos.filter((t) => !t.completed).length;
  const overdue = todos.filter((t) => !t.completed && isOverdue(t.deadline)).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const priorityCounts = { High: 0, Medium: 0, Low: 0 };
  todos.forEach((t) => {
    priorityCounts[t.priority]++;
  });
  const maxCount = Math.max(...Object.values(priorityCounts), 1);

  const urgentTodos = todos
    .filter((t) => {
      if (t.completed) return false;
      const dl = new Date(t.deadline);
      const diff = dl.getTime() - Date.now();
      return diff > 0 && diff < 24 * 60 * 60 * 1000;
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  if (!hydrated) {
    return (
      <>
        <Header title="통계" showBack />
        <div className="max-w-[480px] mx-auto px-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl h-20 animate-pulse bg-surface-container-low" />
            ))}
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <Header title="통계" showBack />
      <div className="max-w-[480px] mx-auto px-6 space-y-8 mt-4 pb-32">
        {total === 0 ? (
          <div className="bg-surface-container-low rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">
              analytics
            </span>
            <p className="text-on-surface-variant font-medium">아직 할 일이 없습니다</p>
          </div>
        ) : (
          <>
            {/* Metric Bento Grid */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-xl flex flex-col gap-1">
                <span className="text-on-secondary-container font-medium text-xs">전체 할 일</span>
                <span className="text-3xl font-headline font-extrabold text-on-surface">{total}</span>
              </div>
              <div className="bg-primary-container p-5 rounded-xl flex flex-col gap-1">
                <span className="text-on-primary-container font-medium text-xs">완료됨</span>
                <span className="text-3xl font-headline font-extrabold text-white">{completed}</span>
              </div>
              <div className="bg-surface-container-low p-5 rounded-xl flex flex-col gap-1">
                <span className="text-on-surface-variant font-medium text-xs">진행 중</span>
                <span className="text-3xl font-headline font-extrabold text-on-surface">{pending}</span>
              </div>
              <div className="bg-tertiary-container p-5 rounded-xl flex flex-col gap-1">
                <span className="text-on-tertiary-container font-medium text-xs">기한 초과</span>
                <span className="text-3xl font-headline font-extrabold text-white">{overdue}</span>
              </div>
            </section>

            {/* Progress */}
            <section className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="text-on-surface font-headline font-bold text-lg">전체 달성률</h2>
                <span className="text-primary font-bold text-2xl">{completionRate}%</span>
              </div>
              <div className="w-full bg-surface-container-high h-4 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </section>

            {/* Priority Chart */}
            <section className="space-y-4">
              <h2 className="text-on-surface font-headline font-bold text-lg">우선순위 분포</h2>
              <div className="bg-surface-container-lowest p-6 rounded-xl space-y-6">
                <div className="flex items-end justify-between gap-4 h-32 px-2">
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div
                      className="w-full bg-tertiary-container rounded-t-lg transition-all duration-500"
                      style={{ height: `${(priorityCounts.High / maxCount) * 100}%` }}
                    />
                    <span className="text-[10px] text-on-surface-variant font-medium">긴급</span>
                    <span className="text-xs font-bold text-on-surface">{priorityCounts.High}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div
                      className="w-full bg-primary-container rounded-t-lg transition-all duration-500"
                      style={{ height: `${(priorityCounts.Medium / maxCount) * 100}%` }}
                    />
                    <span className="text-[10px] text-on-surface-variant font-medium">보통</span>
                    <span className="text-xs font-bold text-on-surface">{priorityCounts.Medium}</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div
                      className="w-full bg-secondary-container rounded-t-lg transition-all duration-500"
                      style={{ height: `${(priorityCounts.Low / maxCount) * 100}%` }}
                    />
                    <span className="text-[10px] text-on-surface-variant font-medium">낮음</span>
                    <span className="text-xs font-bold text-on-surface">{priorityCounts.Low}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Urgent Tasks */}
            {urgentTodos.length > 0 && (
              <section className="space-y-4 pb-4">
                <h2 className="text-on-surface font-headline font-bold text-lg">집중 과제 (긴급)</h2>
                <div className="space-y-3">
                  {urgentTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="bg-surface-container-lowest p-5 rounded-xl relative flex items-center justify-between"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-tertiary-container rounded-r-full" />
                      <div className="pl-2">
                        <h3 className="font-semibold text-on-surface">{todo.title}</h3>
                        <p className="text-xs text-on-surface-variant mt-1">
                          {formatDeadlineFull(todo.deadline)} 마감
                        </p>
                      </div>
                      <span
                        className="material-symbols-outlined text-tertiary text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        priority_high
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </>
  );
}
