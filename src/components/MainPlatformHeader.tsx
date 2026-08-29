"use client";

import React from "react";
import { UserProfile } from "@/types/party";
import { PartyPopper, Flame, Ticket, PlusCircle, User, Settings, Award } from "lucide-react";

export type LandingTab = "explore" | "my_parties";

interface MainPlatformHeaderProps {
  user: UserProfile | null;
  landingTab: LandingTab;
  setLandingTab: (tab: LandingTab) => void;
  onEditProfile: () => void;
  onOpenWallet: () => void;
  onOpenCreateParty: () => void;
}

export default function MainPlatformHeader({
  user,
  landingTab,
  setLandingTab,
  onEditProfile,
  onOpenWallet,
  onOpenCreateParty,
}: MainPlatformHeaderProps) {
  const unusedCouponCount = user?.myCoupons?.filter((c) => !c.isUsed).length || 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* 서비스 로고 */}
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setLandingTab("explore")}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-party-pink to-party-purple flex items-center justify-center text-white shadow-lg shadow-pink-500/30 group-hover:scale-105 transition">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
              <span>PartyQuest</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-party-pink to-party-cyan text-white uppercase tracking-wider">
                PLATFORM
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">
              이벤터스 & Luma 스타일 파티 플랫폼
            </span>
          </div>
        </div>

        {/* 오른쪽 액션 버튼 (마이월렛 & 프로필) */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateParty}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>파티 개설</span>
          </button>

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

          {user ? (
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
            </button>
          ) : (
            <button
              onClick={onEditProfile}
              className="px-3 py-1.5 rounded-2xl bg-gradient-to-r from-party-pink to-party-purple text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>입장</span>
            </button>
          )}
        </div>
      </div>

      {/* 랜딩 전용 네비게이션 (🔥 진행 중인 파티 탐색 vs 🎟️ 내 참여 파티) */}
      <nav className="max-w-5xl mx-auto px-4 flex items-center justify-start gap-2 border-t border-purple-500/10 py-2">
        <button
          onClick={() => setLandingTab("explore")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            landingTab === "explore"
              ? "bg-party-pink text-white shadow-md shadow-pink-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Flame className="w-3.5 h-3.5 text-amber-300" />
          <span>🔥 파티 탐색 (Platform Feed)</span>
        </button>

        <button
          onClick={() => setLandingTab("my_parties")}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
            landingTab === "my_parties"
              ? "bg-party-purple text-white shadow-md shadow-purple-500/20"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Ticket className="w-3.5 h-3.5 text-cyan-400" />
          <span>🎟️ 내 참여 파티</span>
        </button>

        <button
          onClick={onOpenCreateParty}
          className="sm:hidden py-2 px-3 rounded-xl bg-amber-400 text-slate-950 text-xs font-black ml-auto flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ 파티 개설</span>
        </button>
      </nav>
    </header>
  );
}
