"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Zap, CheckCircle2 } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { UserProfile } from "@/types/party";

interface JudgeQuickBannerProps {
  onQuickSetup: (judgeUser: UserProfile) => void;
}

export default function JudgeQuickBanner({ onQuickSetup }: JudgeQuickBannerProps) {
  const [activated, setActivated] = useState(false);

  const handleQuickSetup = () => {
    const judgeUser: UserProfile = {
      id: "judge_ai_" + Date.now(),
      nickname: "AI_Judge",
      role: "🚀 창업가",
      bio: "해커톤 심사 에이전트 (Playwright Automated Test)",
      points: 150,
      completedQuestIds: ["quest_1", "quest_2"],
      joinedAt: new Date().toISOString(),
      avatarColor: "from-cyan-500 to-blue-600",
    };

    localStorage.setItem("partyquest_user", JSON.stringify(judgeUser));
    onQuickSetup(judgeUser);
    triggerConfetti();
    setActivated(true);
  };

  return (
    <div className="bg-gradient-to-r from-cyan-950/90 via-purple-950/90 to-slate-900/90 border-b border-cyan-500/30 px-4 py-2 text-xs text-slate-200">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-semibold text-cyan-300">
            [심사관/데모 가이드] Playwright 브라우저 자동화 최적화 완료
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickSetup}
            disabled={activated}
            className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activated
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:opacity-90 active:scale-95 shadow-md shadow-cyan-500/20"
            }`}
          >
            {activated ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>원클릭 데모 세팅 완료 (150P 적립)</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>⚡️ 심사관 원클릭 자동 체험</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
