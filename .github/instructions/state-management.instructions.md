---
description: "Use when working on Zustand store, data persistence, localStorage, todo CRUD operations, or data utilities. Covers state management patterns and data flow."
applyTo: ["stayon-next/src/store/**", "stayon-next/src/lib/**", "stayon-next/src/types/**"]
---
# State Management & Data

## Zustand Store (`useTodoStore`)
- 단일 store에서 모든 todo 상태 관리
- `hydrate()`: 앱 시작시 localStorage → store 로드 (StoreHydration 컴포넌트)
- 모든 mutation은 즉시 `saveTodos()` / `saveNextId()` 호출하여 영속화

## Store API
```typescript
hydrate()                                    // localStorage → store
addTodo(data: Omit<Todo, "id" | "completed">) // 새 할일 추가
updateTodo(id: number, data: Partial<Todo>)   // 부분 업데이트
deleteTodo(id: number)                        // 삭제
toggleTodo(id: number)                        // 완료 토글
clearAll()                                    // 전체 삭제
getTodoById(id: number)                       // 단건 조회
```

## Todo Type
```typescript
interface Todo {
  id: number;
  title: string;
  description: string;
  deadline: string;   // ISO 8601 string
  priority: "High" | "Medium" | "Low";
  completed: boolean;
}
```

## Data Flow
1. `StoreHydration` → `hydrate()` 호출 (mount시 1회)
2. 각 page에서 `useTodoStore((s) => s.todos)` 선택적 구독
3. mutation → store 업데이트 + localStorage 동기화
4. `hydrated` 플래그로 SSR 불일치 방지 (false일 때 skeleton 표시)

## Utility Functions (`lib/utils.ts`)
| Function | Purpose |
|----------|---------|
| `getTimeUntilDeadline(deadline)` | "N일 N시간 남음" 형식 |
| `isUrgent(deadline)` | 24시간 이내 여부 |
| `isOverdue(deadline)` | 마감 초과 여부 |
| `formatDeadline(deadline)` | "MM-DD HH:mm" |
| `formatDeadlineFull(deadline)` | "오전/오후 H:mm" |
| `todosToCSV(todos)` | CSV 내보내기 문자열 |

## 주의사항
- `typeof window === "undefined"` 가드 필수 (SSR 환경)
- localStorage key: `stayon_todos`, `stayon_next_id`
- id는 auto-increment (nextId 관리)
