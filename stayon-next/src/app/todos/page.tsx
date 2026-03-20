"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import PriorityBadge from "@/components/PriorityBadge";
import ConfirmDialog, { useToast } from "@/components/ConfirmDialog";
import { useTodoStore } from "@/store/useTodoStore";
import { getTimeUntilDeadline, isUrgent, formatDeadline } from "@/lib/utils";
import { Todo } from "@/types/todo";

type SortOption = "deadline" | "priority";

export default function TodoListPage() {
  const todos = useTodoStore((s) => s.todos);
  const hydrated = useTodoStore((s) => s.hydrated);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const deleteTodo = useTodoStore((s) => s.deleteTodo);
  const [sortBy, setSortBy] = useState<SortOption>("priority");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { showToast, ToastComponent } = useToast();

  function sortTodos(list: Todo[]): Todo[] {
    if (sortBy === "deadline") {
      return [...list].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    }
    const order = { High: 0, Medium: 1, Low: 2 };
    return [...list].sort((a, b) => order[a.priority] - order[b.priority]);
  }

  const pendingTodos = sortTodos(todos.filter((t) => !t.completed));
  const completedTodos = todos.filter((t) => t.completed);

  function handleDelete() {
    if (deleteTarget !== null) {
      deleteTodo(deleteTarget);
      showToast("삭제되었습니다");
      setDeleteTarget(null);
    }
  }

  function barColor(priority: string, completed: boolean) {
    if (completed) return ""; // no bar for completed
    if (priority === "High") return "bg-tertiary-container";
    if (priority === "Medium") return "bg-primary-container";
    return "bg-secondary-fixed-dim";
  }

  if (!hydrated) {
    return (
      <>
        <Header title="할 일 목록" showBack />
        <main className="max-w-[480px] mx-auto px-6 space-y-8 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-4 h-16 animate-pulse" />
          ))}
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      {ToastComponent}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="할 일 삭제"
        message="이 할 일을 삭제하시겠습니까?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Header title="할 일 목록" showBack />

      <main className="max-w-[480px] mx-auto px-6 space-y-8 mt-4 pb-8">
        {/* Sort Bar + Add Button */}
        <section className="flex items-center justify-between gap-3">
          <div className="flex-1 relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="w-full appearance-none px-4 py-3 bg-surface-container-low rounded-xl text-on-surface-variant text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="priority">우선순위순</option>
              <option value="deadline">마감임박순</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
            </div>
          </div>
          <Link
            href="/todos/new"
            className="bg-primary-container text-on-primary-container p-3 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
            <span className="ml-2 font-bold text-sm">새 할 일</span>
          </Link>
        </section>

        {/* In Progress */}
        {pendingTodos.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-lg text-on-surface">진행 중</h2>
              <span className="bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full text-xs font-bold">
                {pendingTodos.length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="group flex items-center bg-surface-container-lowest p-4 rounded-xl relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${barColor(todo.priority, false)}`} />
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="todo-check"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                  </label>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-on-surface font-semibold text-sm truncate">{todo.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <PriorityBadge priority={todo.priority} />
                      <span className="text-[10px] text-outline">
                        {isUrgent(todo.deadline)
                          ? getTimeUntilDeadline(todo.deadline)
                          : formatDeadline(todo.deadline)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/todos/${todo.id}/edit`}
                    className="text-outline-variant hover:text-primary active:scale-90 transition-all p-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(todo.id)}
                    className="text-outline-variant hover:text-error active:scale-90 transition-all p-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completedTodos.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-lg text-on-surface-variant">완료됨</h2>
              <span className="text-outline text-xs font-medium">{completedTodos.length}건</span>
            </div>
            <div className="space-y-3 opacity-60">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center bg-surface-container-low p-4 rounded-xl relative overflow-hidden transition-all"
                >
                  <button onClick={() => toggleTodo(todo.id)} className="flex items-center">
                    <span
                      className="material-symbols-outlined text-primary-container"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      check_circle
                    </span>
                  </button>
                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="text-on-surface-variant font-medium text-sm line-through truncate">
                      {todo.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-outline">
                        완료: {formatDeadline(todo.deadline)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(todo.id)}
                    className="text-outline-variant p-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {pendingTodos.length === 0 && completedTodos.length === 0 && (
          <div className="bg-surface-container-low rounded-xl p-12 text-center">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-3 block">
              checklist
            </span>
            <p className="text-on-surface-variant font-medium">할 일이 없습니다</p>
            <Link
              href="/todos/new"
              className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold active:scale-95 transition-transform"
            >
              첫 할 일 추가하기
            </Link>
          </div>
        )}
      </main>
      <BottomNav />
    </>
  );
}
