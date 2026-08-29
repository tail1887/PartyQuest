"use client";

import React from "react";
import { UserProfile } from "@/types/party";
import { PartyPopper, Users, Award, User, Settings, Sparkles, Trophy, Gift, Ticket } from "lucide-react";

export type ActiveTab = "quests" | "networking" | "leaderboard" | "rewards" | "host";

interface HeaderProps {
  user: UserProfile | null;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onEditProfile: () => void;
  onOpenWallet?: () => void;
  activeGuestsCount: number;
}

export default function Header({
  user,
  activeTab,
  setActiveTab,
  onEditProfile,
  onOpenWallet,
  activeGuestsCount,
}: HeaderProps) {
  const unusedCouponCount = user?.myCoupons?.filter((c) => !c.isUsed).length || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* 서비스 로고 */}
        <div
          onClick={() => setActiveTab("quests")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-party-pink to-party-purple flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>PartyQuest</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-party-pink to-party-cyan text-white uppercase tracking-wider">
                LIVE
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">
              인터랙티브 파티 매니저
            </span>
          </div>
        </div>

        {/* 오른쪽 프로필 & 포인트 & 마이월렛 & 라이브 참여자 정보 */}
        <div className="flex items-center gap-2.5">
          {/* 라이브 참가자 수 */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{activeGuestsCount}명 서버 접속 중</span>
          </div>

          {user ? (
            <div className="flex items-center gap-2">
              {/* 내 월렛 바로가기 버튼 */}
              {onOpenWallet && (
                <button
                  onClick={onOpenWallet}
                  className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 active:scale-95 text-slate-950 text-xs font-black shadow-md shadow-cyan-500/20 flex items-center gap-1 cursor-pointer"
                  title="내 쿠폰/QR 보관함 열기"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">마이월렛</span>
                  <span className="bg-slate-950 text-cyan-300 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold">
                    {unusedCouponCount}
                  </span>
                </button>
              )}

              {/* 포인트 뱃지 */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-party-pink/10 border border-party-pink/30 text-party-pink text-xs font-black shadow-inner">
                <Award className="w-4 h-4 text-party-pink" />
                <span>{user.points} P</span>
              </div>

              {/* 내 프로필 닉네임 버튼 */}
              <button
                onClick={onEditProfile}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-xs text-slate-200 transition cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-[10px] font-bold`}>
                  {user.nickname.slice(0, 1)}
                </div>
                <span className="font-bold max-w-[80px] sm:max-w-[120px] truncate">
                  {user.nickname}
                </span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          ) : (
            <button
              onClick={onEditProfile}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-party-pink to-party-purple hover:opacity-90 active:scale-95 text-white text-xs font-bold shadow-lg shadow-pink-500/25 transition cursor-pointer flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>3초 간편 입장</span>
            </button>
          )}
        </div>
      </div>

      {/* 메인 탭 네비게이션 (5대 탭) */}
      <nav className="max-w-5xl mx-auto px-4 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar border-t border-purple-500/10 py-2">
        <button
          onClick={() => setActiveTab("quests")}
          className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "quests"
              ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-party-pink" />
          <span>🎯 퀘스트</span>
        </button>

        <button
          onClick={() => setActiveTab("networking")}
          className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "networking"
              ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-party-cyan" />
          <span>🤝 네트워킹</span>
        </button>

        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "leaderboard"
              ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>🏆 랭킹</span>
        </button>

        <button
          onClick={() => setActiveTab("rewards")}
          className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "rewards"
              ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-cyan-400" />
          <span>🎁 리워드</span>
        </button>

        <button
          onClick={() => setActiveTab("host")}
          className={`flex-1 min-w-[75px] py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "host"
              ? "bg-party-purple text-white shadow-lg shadow-purple-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-purple-300" />
          <span>⚙️ 호스트</span>
        </button>
      </nav>
    </header>
  );
}
