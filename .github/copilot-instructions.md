# StayOn - Project Guidelines

## Overview
StayOn은 Next.js 14 (App Router) + TypeScript + Tailwind CSS로 구축된 할 일 관리 웹앱입니다.
소스코드는 `stayon-next/` 디렉토리에 위치합니다.

## Tech Stack
- **Framework:** Next.js 14.2 (App Router), React 18, TypeScript 5
- **Styling:** Tailwind CSS 3.4 with Material Design 3 color tokens
- **State:** Zustand 4.5 (`src/store/useTodoStore.ts`)
- **Persistence:** localStorage (브라우저 기반, 서버 DB 없음)
- **Fonts:** Manrope (headline), Inter (body), Material Symbols Outlined (icons)

## Architecture
```
stayon-next/src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Home (대시보드)
│   ├── todos/        # 목록, 추가, 수정
│   ├── stats/        # 통계
│   └── settings/     # 설정
├── components/       # 공유 UI 컴포넌트
├── store/            # Zustand 스토어
├── lib/              # 유틸리티 함수
└── types/            # TypeScript 타입 정의
```

## Design System — "The Mindful Canvas"
- **No 1px borders.** Tonal layering으로 경계를 표현 (surface token 계층)
- **Surface 계층:** background → surface-container-low → surface-container-lowest (카드)
- **Glassmorphism:** 네비게이션 바에 backdrop-blur + 반투명 배경 적용
- **Color tokens:** `tailwind.config.ts`에 정의된 Material Design 3 토큰 사용
- **Font 규칙:** headline/제목 → `font-headline` (Manrope), 본문 → `font-body` (Inter)
- 상세: `stitch/sage_clarity/DESIGN.md` 참조

## Code Conventions
- 모든 페이지 컴포넌트는 `"use client"` (CSR, localStorage 의존)
- Korean UI text (사용자 대면 텍스트는 한국어)
- Zustand store에서 `hydrated` 플래그로 SSR/CSR 불일치 방지
- 아이콘은 Material Symbols Outlined (`<span className="material-symbols-outlined">`)
- path alias: `@/` → `src/`

## Build & Run
```bash
cd stayon-next
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
```

## Git Workflow
- **코드 변경이 발생하면 반드시 `git add` → `git commit` → `git push origin main`을 수행한다.**
- 커밋 메시지는 한국어로 작성하되 conventional commits prefix 사용 (`feat:`, `fix:`, `refactor:`, `style:`, `docs:` 등)
- `stayon-next/` 내 소스 변경만 스테이징한다 (data/, stitch/ 등 비소스 폴더 제외)
- 여러 관련 변경은 하나의 커밋으로, 무관한 변경은 분리 커밋

## Rules
컨텍스트 지연 로딩을 위한 file-specific instructions:
- `.github/instructions/nextjs-pages.instructions.md` — 페이지/라우팅 작업 시
- `.github/instructions/design-system.instructions.md` — UI/스타일링 작업 시
- `.github/instructions/state-management.instructions.md` — 상태/데이터 작업 시
