import type { Metadata } from "next";
import "./globals.css";
import StoreHydration from "@/components/StoreHydration";

export const metadata: Metadata = {
  title: "StayOn - 할 일 관리",
  description: "늘 곁에 있는 할 일 관리 앱",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface min-h-screen pb-32">
        <StoreHydration />
        {children}
      </body>
    </html>
  );
}
