import { Sparkles, PartyPopper } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center gap-3 text-party-pink mb-4 animate-bounce">
        <PartyPopper className="w-10 h-10" />
        <Sparkles className="w-8 h-8 text-party-cyan" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
        PartyQuest
      </h1>
      <p className="text-lg text-slate-300 max-w-md mb-8">
        어색한 모임은 끝! 미션과 퀘스트로 즐기는 인터랙티브 파티 매니저
      </p>
      <div className="bg-party-card border border-purple-500/20 rounded-2xl p-6 shadow-2xl shadow-purple-950/50">
        <span className="text-sm font-semibold text-party-cyan px-3 py-1 bg-cyan-950/60 rounded-full border border-cyan-500/30">
          🚀 Next.js + Tailwind CSS + Lucide Setup Complete
        </span>
      </div>
    </main>
  );
}
