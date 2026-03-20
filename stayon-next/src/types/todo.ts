export interface Todo {
  id: number;
  title: string;
  description: string;
  deadline: string; // ISO string
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  priorityCounts: Record<string, number>;
}
