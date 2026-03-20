---
description: "Use when working on UI styling, colors, typography, spacing, Tailwind classes, or visual design. Covers the 'Mindful Canvas' design system tokens and patterns."
applyTo: ["stayon-next/src/components/**", "stayon-next/tailwind.config.ts", "stayon-next/src/app/globals.css"]
---
# Design System — The Mindful Canvas

## Core Rules
1. **No 1px borders.** 경계는 background color shift로만 표현
2. **Tonal layering:** surface token 계층으로 깊이감 표현
3. **Ghost borders only:** 접근성 필요시 `outline-variant` at 15% opacity

## Surface Hierarchy
```
background (#f9f9f7)          ← 베이스
  └─ surface-container-low    ← 섹션 배경
       └─ surface-container-lowest (white) ← 카드/인터랙티브
```

## Color Token Usage
| Purpose | Token | Example |
|---------|-------|---------|
| 주요 액션 | `primary` / `primary-container` | 버튼, FAB |
| 텍스트 | `on-surface` / `on-surface-variant` | 제목 / 부제 |
| 긴급 | `tertiary-container` | High priority 바, 마감임박 |
| 보통 | `primary-container` | Medium priority |
| 낮음 | `secondary-container` | Low priority |
| 완료 | `primary-container` (FILL 1) | 체크 아이콘 |
| 에러 | `error` | 삭제 호버 |

## Typography
- `font-headline` (Manrope): 제목, 큰 숫자, 메트릭
- `font-body` (Inter): 본문, 라벨, 설명
- 아이콘: `material-symbols-outlined` class + fontVariationSettings for filled

## Component Patterns
- 카드: `bg-surface-container-lowest rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]`
- 섹션: `bg-surface-container-low rounded-xl p-6`
- Glassmorphism nav: `bg-surface/80 backdrop-blur-xl`
- Priority accent bar: `absolute left-0 top-0 bottom-0 w-1 bg-{token}`

## 참고
상세 디자인 가이드: `stitch/sage_clarity/DESIGN.md`
