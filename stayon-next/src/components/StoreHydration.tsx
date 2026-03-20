"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/store/useTodoStore";

export default function StoreHydration() {
  const hydrate = useTodoStore((s) => s.hydrate);
  const hydrated = useTodoStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  return null;
}
