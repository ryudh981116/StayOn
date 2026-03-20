"use client";

import { create } from "zustand";
import { Todo } from "@/types/todo";
import { loadTodos, saveTodos, loadNextId, saveNextId } from "@/lib/utils";

interface TodoStore {
  todos: Todo[];
  nextId: number;
  hydrated: boolean;
  hydrate: () => void;

  addTodo: (todo: Omit<Todo, "id" | "completed">) => void;
  updateTodo: (id: number, data: Partial<Omit<Todo, "id">>) => void;
  deleteTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  clearAll: () => void;
  getTodoById: (id: number) => Todo | undefined;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  nextId: 1,
  hydrated: false,

  hydrate: () => {
    const todos = loadTodos();
    const nextId = loadNextId();
    set({ todos, nextId, hydrated: true });
  },

  addTodo: (data) => {
    const { todos, nextId } = get();
    const newTodo: Todo = { ...data, id: nextId, completed: false };
    const updated = [...todos, newTodo];
    const newNextId = nextId + 1;
    saveTodos(updated);
    saveNextId(newNextId);
    set({ todos: updated, nextId: newNextId });
  },

  updateTodo: (id, data) => {
    const { todos } = get();
    const updated = todos.map((t) => (t.id === id ? { ...t, ...data } : t));
    saveTodos(updated);
    set({ todos: updated });
  },

  deleteTodo: (id) => {
    const { todos } = get();
    const updated = todos.filter((t) => t.id !== id);
    saveTodos(updated);
    set({ todos: updated });
  },

  toggleTodo: (id) => {
    const { todos } = get();
    const updated = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveTodos(updated);
    set({ todos: updated });
  },

  clearAll: () => {
    saveTodos([]);
    saveNextId(1);
    set({ todos: [], nextId: 1 });
  },

  getTodoById: (id) => {
    return get().todos.find((t) => t.id === id);
  },
}));
