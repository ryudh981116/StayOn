"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showLogo?: boolean;
}

export default function Header({ title, showBack = false, showLogo = false }: HeaderProps) {
  const router = useRouter();

  if (showLogo) {
    // Home header style
    return (
      <header className="sticky top-0 w-full max-w-[480px] mx-auto z-50 bg-[#FAFAF8] bg-gradient-to-b from-[#FAFAF8] to-transparent">
        <div className="relative flex items-center justify-center px-6 h-16">
          <span className="text-[#557C55] font-extrabold text-2xl tracking-tighter font-headline">
            StayOn
          </span>
        </div>
      </header>
    );
  }

  // Sub-page header
  return (
    <header className="sticky top-0 w-full max-w-[480px] mx-auto z-50 bg-[#FAFAF8] flex items-center justify-between px-6 h-16">
      {showBack ? (
        <button
          onClick={() => router.back()}
          className="active:scale-95 transition-transform text-[#557C55] hover:opacity-80"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
      ) : (
        <div className="w-6" />
      )}
      <h1 className="font-headline font-bold text-xl tracking-tight text-[#557C55] absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>
      <div className="w-6" />
    </header>
  );
}
