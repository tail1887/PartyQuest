"use client";

import React from "react";
import { Sparkles, Trophy, Users, Award, Gift, Settings, User } from "lucide-react";
import { UserProfile } from "@/types/party";

export type ActiveTab = "quests" | "networking" | "leaderboard" | "rewards" | "host";

interface HeaderProps {
  user: UserProfile | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEditProfile: () => void;
  activeGuestsCount: number;
}

export default function Header({
  user,
  activeTab,
  setActiveTab,
  onEditProfile,
  activeGuestsCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-party-dark/80 backdrop-blur-xl border-b border-purple-500/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* 로고 & 파티 타이틀 */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-party-pink to-party-purple flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-purple-100 to-pink-300 bg-clip-text text-transparent">
                PartyQuest
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3 text-cyan-400" /> 현재 <strong className="text-cyan-300">{activeGuestsCount}명</strong> 참여 중
            </p>
          </div>
        </div>

        {/* 내 프로필 및 포인트 정보 */}
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 포인트 뱃지 */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-extrabold tracking-wide">{user.points} P</span>
            </div>

            {/* 프로필 버튼 */}
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-party-card border border-purple-500/30 rounded-xl hover:border-party-pink transition text-xs font-semibold text-slate-200"
              title="프로필 수정"
            >
              <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-[10px] text-white font-bold`}>
                {user.nickname.slice(0, 1)}
              </div>
              <span className="hidden sm:inline max-w-[80px] truncate">{user.nickname}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onEditProfile}
            className="px-4 py-2 bg-gradient-to-r from-party-purple to-party-pink text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 hover:opacity-90 transition"
          >
            입장하기
          </button>
        )}
      </div>

      {/* 메인 탭 네비게이션 */}
      <div className="max-w-5xl mx-auto px-4 pb-2">
        <nav className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab("quests")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "quests"
                ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            🎯 퀘스트 목록
          </button>

          <button
            onClick={() => setActiveTab("networking")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "networking"
                ? "bg-party-pink text-white shadow-lg shadow-pink-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            🤝 네트워킹 월
          </button>

          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-party-amber text-slate-950 shadow-lg shadow-amber-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            🏆 실시간 랭킹
          </button>

          <button
            onClick={() => setActiveTab("rewards")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              activeTab === "rewards"
                ? "bg-party-cyan text-slate-950 shadow-lg shadow-cyan-500/30"
                : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            🎁 리워드 교환
          </button>

          <button
            onClick={() => setActiveTab("host")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ml-auto ${
              activeTab === "host"
                ? "bg-slate-700 text-white"
                : "bg-slate-900/40 text-slate-400 hover:text-slate-200"
            }`}
          >
            ⚙️ 호스트 관리
          </button>
        </nav>
      </div>
    </header>
  );
}
