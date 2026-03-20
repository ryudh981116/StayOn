---
description: "Use when creating, editing, or debugging Next.js page components, layouts, routing, or navigation. Covers App Router patterns, dynamic routes, and page structure."
applyTo: "stayon-next/src/app/**"
---
# Next.js Pages & Routing

## Page Structure
- 모든 page.tsx는 `"use client"` 선언 (localStorage 기반 앱)
- Zustand hydration 체크: `if (!hydrated)` → skeleton UI 반환
- 레이아웃: `max-w-[480px] mx-auto px-6` (모바일 중심)

## Component Pattern
```tsx
export default function SomePage() {
  const hydrated = useTodoStore((s) => s.hydrated);
  // ... selectors

  if (!hydrated) return <SkeletonUI />;

  return (
    <>
      <Header title="페이지명" showBack />
      <main className="max-w-[480px] mx-auto px-6 space-y-8 mt-4 pb-32">
        {/* content */}
      </main>
      <BottomNav />
    </>
  );
}
```

## Routing Map
| Path | Page | Description |
|------|------|-------------|
| `/` | Home | 대시보드, 메트릭 카드, 진행중 미리보기 |
| `/todos` | TodoList | 정렬, 체크, 수정/삭제 |
| `/todos/new` | NewTodo | 추가 폼 (title, deadline, priority, description) |
| `/todos/[id]/edit` | EditTodo | 수정 폼, 삭제 기능 포함 |
| `/stats` | Stats | 통계 그리드, 달성률, 차트 |
| `/settings` | Settings | CSV 내보내기, 데이터 삭제 |

## Navigation
- `<Header>`: showLogo (홈) 또는 showBack (서브) 모드
- `<BottomNav>`: 4개 탭 (home, todos, stats, settings)
- FAB: 홈에서 `/todos/new`로 이동하는 플로팅 버튼
