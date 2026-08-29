"use client";

import React, { useState } from "react";
import QuestCard from "./QuestCard";
import { Quest } from "@/types/party";
import { Sparkles, Trophy, PlusCircle, CheckCircle2 } from "lucide-react";

interface QuestListProps {
  quests: Quest[];
  onCompleteQuest: (questId: string, answer?: string, photoUrl?: string) => void;
  onSubmitForApproval?: (questId: string, photoUrl?: string, answerText?: string) => void;
  onApproveSubmission?: (questId: string, submissionId: string) => void;
  onRejectSubmission?: (questId: string, submissionId: string) => void;
  onNavigateSocial: () => void;
  onOpenCreateQuestModal?: () => void;
}

export default function QuestList({
  quests,
  onCompleteQuest,
  onSubmitForApproval,
  onApproveSubmission,
  onRejectSubmission,
  onNavigateSocial,
  onOpenCreateQuestModal,
}: QuestListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");

  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const categories = ["전체", "아이스브레이킹", "스낵바", "미션", "소셜", "유저현상금"];

  const filteredQuests =
    selectedCategory === "전체"
      ? quests
      : quests.filter((q) => q.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* 퀘스트 달성률 프로그레스 바 & 현상금 퀘스트 만들기 버튼 */}
      <div className="bg-party-card border border-purple-500/30 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-party-pink animate-spin-slow" />
              <h3 className="text-lg font-bold text-white">파티 퀘스트 진행도</h3>
            </div>
            <p className="text-xs text-slate-300">
              퀘스트를 완수할 때마다 포인트가 팡팡! 모은 포인트로 리워드를 교환하세요.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-purple-500/30">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">
                달성률: <strong className="text-party-pink">{completedCount}</strong> / {totalCount} ({progressPercent}%)
              </span>
            </div>

            {onOpenCreateQuestModal && (
              <button
                onClick={onOpenCreateQuestModal}
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ 나만의 퀘스트 만들기</span>
              </button>
            )}
          </div>
        </div>

        {/* 프로그레스 게이지 */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-purple-500/20">
          <div
            className="bg-gradient-to-r from-party-pink via-party-purple to-party-cyan h-full rounded-full transition-all duration-500 shadow-md shadow-pink-500/50"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 카테고리 필터링 탭 */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-party-pink to-party-purple text-white shadow-lg shadow-pink-500/20"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 퀘스트 카드 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            currentUser={null}
            onComplete={onCompleteQuest}
            onSubmitForApproval={onSubmitForApproval}
            onApproveSubmission={onApproveSubmission}
            onRejectSubmission={onRejectSubmission}
            onNavigateSocial={onNavigateSocial}
          />
        ))}
      </div>
    </div>
  );
}
