"use client";

import React, { useState } from "react";
import { Quest } from "@/types/party";
import QuestCard from "./QuestCard";
import { Sparkles, CheckCircle, Target, Award } from "lucide-react";

interface QuestListProps {
  quests: Quest[];
  onCompleteQuest: (questId: string, answer?: string) => void;
  onNavigateSocial?: () => void;
}

type CategoryFilter = "ALL" | "아이스브레이킹" | "스낵바" | "미션" | "소셜";

export default function QuestList({ quests, onCompleteQuest, onNavigateSocial }: QuestListProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");

  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalPointsEarned = quests.filter((q) => q.completed).reduce((acc, q) => acc + q.points, 0);
  const maxPossiblePoints = quests.reduce((acc, q) => acc + q.points, 0);

  const filteredQuests = quests.filter((q) => {
    if (selectedCategory === "ALL") return true;
    return q.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* 퀘스트 진행도 헤더 카드 */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-indigo-950/60 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-party-pink" />
              <h3 className="text-lg font-bold text-white">나의 퀘스트 진행 상황</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              총 {totalCount}개 중 <strong className="text-party-pink">{completedCount}개</strong> 완료 ({progressPercent}%)
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-400" />
            <span>퀘스트 획득: <strong>{totalPointsEarned}</strong> / {maxPossiblePoints} P</span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-purple-500/20">
          <div
            className="h-full bg-gradient-to-r from-party-purple via-party-pink to-party-cyan transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(["ALL", "아이스브레이킹", "스낵바", "미션", "소셜"] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === cat
                ? "bg-party-purple/40 border border-party-pink text-white font-bold shadow-md shadow-purple-500/20"
                : "bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            {cat === "ALL" ? "✨ 전체 보기" : cat}
          </button>
        ))}
      </div>

      {/* 퀘스트 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onComplete={onCompleteQuest}
            onNavigateSocial={onNavigateSocial}
          />
        ))}
      </div>
    </div>
  );
}
