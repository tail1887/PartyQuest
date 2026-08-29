"use client";

import React from "react";
import { PartyPopper, Award, Sparkles, ArrowRight, Gift } from "lucide-react";
import { Quest } from "@/types/party";

interface QuestSuccessModalProps {
  quest: Quest | null;
  currentPoints: number;
  onClose: () => void;
  onGoToRewards?: () => void;
}

export default function QuestSuccessModal({
  quest,
  currentPoints,
  onClose,
  onGoToRewards,
}: QuestSuccessModalProps) {
  if (!quest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-sm bg-party-card border border-purple-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/50 text-center text-slate-100 overflow-hidden">
        {/* 네온 글로우 */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-party-pink via-purple-500 to-party-cyan flex items-center justify-center text-white shadow-xl shadow-pink-500/40 animate-bounce">
            <PartyPopper className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
            MISSION COMPLETED!
          </span>

          <h3 className="text-xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent mb-1">
            퀘스트 완수 성공!
          </h3>
          <p className="text-xs text-slate-300 mb-4 line-clamp-2">
            "{quest.title}"
          </p>

          {/* 획득 포인트 박스 */}
          <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 mb-6 shadow-inner">
            <div className="flex items-center justify-center gap-2 text-amber-400 mb-1">
              <Award className="w-6 h-6 animate-pulse" />
              <span className="text-2xl font-black">+{quest.points} P</span>
            </div>
            <p className="text-[11px] text-slate-400">
              현재 보유 총 포인트: <strong className="text-amber-300">{currentPoints} P</strong>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-gradient-to-r from-party-purple to-party-pink hover:opacity-90 active:scale-95 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/25 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>다음 퀘스트 계속하기</span>
            </button>

            {onGoToRewards && (
              <button
                onClick={() => {
                  onClose();
                  onGoToRewards();
                }}
                className="w-full py-2.5 px-4 bg-slate-900/60 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>리워드 교환하러 가기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
