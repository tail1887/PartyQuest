"use client";

import React, { useState } from "react";
import { Sparkles, Dices, Gift, Award, X, RotateCw } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { UserProfile } from "@/types/party";

interface LuckyRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSpinSuccess: (rewardName: string, bonusPoints?: number) => void;
}

const ROULETTE_ITEMS = [
  { name: "🍹 음료 1잔 무료 교환권", color: "from-pink-500 to-rose-500" },
  { name: "✨ bonus +100 포인트!", color: "from-amber-400 to-yellow-300", points: 100 },
  { name: "🎟️ 럭키드로우 경품 응모권", color: "from-purple-500 to-indigo-500" },
  { name: "👑 황금 네온 후광 스킨", color: "from-amber-300 via-orange-400 to-pink-500" },
  { name: "🍕 핑거푸드 무료 스낵 쿠폰", color: "from-emerald-400 to-teal-500" },
  { name: "⚡️ bonus +50 포인트!", color: "from-cyan-400 to-blue-500", points: 50 },
];

export default function LuckyRouletteModal({
  isOpen,
  onClose,
  currentUser,
  onSpinSuccess,
}: LuckyRouletteModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof ROULETTE_ITEMS[0] | null>(null);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const cost = 50;
  const canSpin = currentUser && currentUser.points >= cost;

  const handleSpin = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setResult(null);

    // 랜덤 각도 계산 (최소 5바퀴 + 랜덤 항목)
    const randomIndex = Math.floor(Math.random() * ROULETTE_ITEMS.length);
    const itemDegree = 360 / ROULETTE_ITEMS.length;
    const newDegree = rotation + 1800 + (360 - randomIndex * itemDegree);

    setRotation(newDegree);

    setTimeout(() => {
      setSpinning(false);
      const wonItem = ROULETTE_ITEMS[randomIndex];
      setResult(wonItem);
      triggerConfetti();
      onSpinSuccess(wonItem.name, wonItem.points);
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-party-card border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-center text-slate-100 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white z-20"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-1">
          <Dices className="w-6 h-6 text-party-pink animate-bounce" />
          <h3 className="text-xl font-black bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
            행운의 파티 룰렛
          </h3>
        </div>
        <p className="text-xs text-slate-300 mb-4">
          <span className="text-amber-400 font-bold">50 P</span>로 룰렛을 돌려 꽝 없이 선물을 뽑아보세요!
        </p>

        {/* 룰렛 그래픽 판 */}
        <div className="relative w-52 h-52 mx-auto mb-5 my-2 flex items-center justify-center">
          {/* 화살표 가이드 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[18px] border-t-party-pink drop-shadow-md" />

          {/* 회전하는 룰렛 원판 */}
          <div
            className="w-full h-full rounded-full border-4 border-purple-500/40 overflow-hidden shadow-2xl relative transition-all ease-out duration-[3500ms]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {ROULETTE_ITEMS.map((item, idx) => {
              const angle = (360 / ROULETTE_ITEMS.length) * idx;
              return (
                <div
                  key={idx}
                  className={`absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center p-2 bg-gradient-to-tr ${item.color} text-slate-950 text-[10px] font-black text-center shadow-inner`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <span className="transform -rotate-45 block truncate max-w-[70px]">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 결과 알림 */}
        {result && (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-3.5 mb-4 animate-in zoom-in-95">
            <span className="text-[10px] font-bold text-emerald-400 block">🎉 당첨을 축하합니다!</span>
            <span className="text-sm font-black text-white">{result.name}</span>
          </div>
        )}

        {/* 돌리기 버튼 */}
        <button
          onClick={handleSpin}
          disabled={!canSpin || spinning}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
            canSpin && !spinning
              ? "bg-gradient-to-r from-party-pink via-party-purple to-party-cyan text-white shadow-pink-500/30 hover:opacity-90 active:scale-95"
              : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
          }`}
        >
          {spinning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>룰렛이 돌아가는 중...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>50 P 로 룰렛 돌리기</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
