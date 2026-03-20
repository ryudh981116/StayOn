"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home_max", label: "홈" },
  { href: "/todos", icon: "format_list_bulleted", label: "목록" },
  { href: "/stats", icon: "bar_chart_4_bars", label: "통계" },
  { href: "/settings", icon: "person", label: "설정" },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[432px] rounded-[2rem] z-50 bg-white/85 backdrop-blur-xl shadow-[0_20px_40px_rgba(26,28,27,0.06)] flex justify-around items-center px-4 py-3">
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              active
                ? "flex items-center justify-center bg-[#557C55] text-white rounded-full w-12 h-12 active:scale-110 transition-transform duration-300 ease-out"
                : "flex items-center justify-center text-stone-400 w-12 h-12 hover:bg-stone-100 rounded-full transition-colors active:scale-110 duration-300 ease-out"
            }
          >
            <span
              className="material-symbols-outlined"
              style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {item.icon}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
