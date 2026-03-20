import { Todo } from "@/types/todo";

const STORAGE_KEY = "stayon_todos";
const NEXT_ID_KEY = "stayon_next_id";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function loadNextId(): number {
  if (typeof window === "undefined") return 1;
  try {
    const raw = localStorage.getItem(NEXT_ID_KEY);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

export function saveNextId(id: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(NEXT_ID_KEY, id.toString());
}

export function getTimeUntilDeadline(deadline: string): string {
  const now = new Date();
  const dl = new Date(deadline);
  const delta = dl.getTime() - now.getTime();

  if (delta < 0) return "마감 완료";

  const days = Math.floor(delta / (1000 * 60 * 60 * 24));
  const hours = Math.floor((delta % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((delta % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return `${minutes}분 남음`;
}

export function isUrgent(deadline: string): boolean {
  const now = new Date();
  const dl = new Date(deadline);
  return dl.getTime() - now.getTime() < 24 * 60 * 60 * 1000 && dl.getTime() > now.getTime();
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline).getTime() < Date.now();
}

export function formatDeadline(deadline: string): string {
  const d = new Date(deadline);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${month}-${day} ${hour}:${minute}`;
}

export function formatDeadlineFull(deadline: string): string {
  const d = new Date(deadline);
  const ampm = d.getHours() < 12 ? "오전" : "오후";
  const hour = d.getHours() % 12 || 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${ampm} ${hour}:${minute}`;
}

export function todosToCSV(todos: Todo[]): string {
  const header = "id,title,description,deadline,priority,completed";
  const rows = todos.map(
    (t) =>
      `${t.id},"${t.title.replace(/"/g, '""')}","${t.description.replace(/"/g, '""')}",${t.deadline},${t.priority},${t.completed}`
  );
  return [header, ...rows].join("\n");
}
