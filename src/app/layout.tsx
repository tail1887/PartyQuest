import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PartyQuest | 인터랙티브 파티 퀘스트 & 네트워킹 매니저",
  description: "어색한 모임은 끝! 미션과 퀘스트로 즐기는 인터랙티브 파티 매니저 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className="min-h-screen bg-party-dark text-slate-100 selection:bg-party-pink selection:text-white relative">
        <div className="fixed inset-0 bg-neon-glow pointer-events-none z-0" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
