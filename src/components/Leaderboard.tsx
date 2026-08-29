"use client";

import React from "react";
import { UserProfile } from "@/types/party";
import { Trophy, Medal, Award, Flame, CheckCircle, Sparkles, Crown } from "lucide-react";

interface LeaderboardProps {
  currentUser: UserProfile | null;
  guests: UserProfile[];
}

export default function Leaderboard({ currentUser, guests }: LeaderboardProps) {
  // 포인트 기준 내림차순 정렬
  const sortedGuests = [...guests].sort((a, b) => b.points - a.points);
  const myRank = currentUser ? sortedGuests.findIndex((g) => g.id === currentUser.id) + 1 : null;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/40">
            <Crown className="w-4 h-4" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 flex items-center justify-center font-black shadow-md">
            2
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-orange-500 text-white flex items-center justify-center font-black shadow-md">
            3
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-700">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-amber-950/60 via-purple-950/70 to-slate-900/80 border border-amber-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-white">실시간 파티 퀘스트 랭킹</h3>
          </div>
          <p className="text-xs text-slate-300">
            가장 열정적으로 퀘스트를 달성하고 소통한 참가자 순위입니다!
          </p>
        </div>

        {/* 내 순위 하이라이트 */}
        {currentUser && myRank && (
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl shadow-lg">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">내 현재 순위</span>
              <span className="text-sm font-black text-amber-300">{myRank}위 / {sortedGuests.length}명</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-party-pink/20 text-party-pink border border-party-pink/40 flex items-center justify-center font-bold text-xs">
              {currentUser.points}P
            </div>
          </div>
        )}
      </div>

      {/* 랭킹 리스트 */}
      <div className="space-y-3">
        {sortedGuests.map((guest, idx) => {
          const rank = idx + 1;
          const isMe = currentUser?.id === guest.id;
          const isTop3 = rank <= 3;

          return (
            <div
              key={guest.id}
              className={`flex items-center justify-between p-4 rounded-2xl border transition duration-200 ${
                isMe
                  ? "bg-party-card border-party-pink/60 shadow-xl shadow-pink-950/40 ring-1 ring-party-pink/40"
                  : isTop3
                  ? "bg-party-card/90 border-purple-500/30 shadow-md shadow-purple-950/20"
                  : "bg-slate-900/50 border-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* 랭킹 뱃지 */}
                {getRankBadge(rank)}

                {/* 프로필 아바타 */}
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${guest.avatarColor} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                  {guest.nickname.slice(0, 1)}
                </div>

                {/* 닉네임 & 정보 */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">{guest.nickname}</span>
                    {isMe && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-party-pink text-white">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span>{guest.role}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      {guest.completedQuestIds.length}개 완료
                    </span>
                  </div>
                </div>
              </div>

              {/* 포인트 */}
              <div className="text-right flex-shrink-0 pl-3">
                <span className={`text-base font-black tracking-tight ${isTop3 ? "text-amber-400" : "text-slate-200"}`}>
                  {guest.points} <span className="text-xs font-semibold text-slate-400">P</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
