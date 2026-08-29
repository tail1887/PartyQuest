"use client";

import React, { useState } from "react";
import { Sparkles, Dices, X, RotateCw } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { UserProfile } from "@/types/party";

interface LuckyRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSpinSuccess: (rewardName: string, bonusPoints?: number) => void;
}

interface RouletteItem {
  name: string;
  shortName: string;
  color1: string;
  color2: string;
  points?: number;
}

const ROULETTE_ITEMS: RouletteItem[] = [
  { name: "🍹 음료 1잔 무료 교환권", shortName: "🍹 음료 1잔", color1: "#ec4899", color2: "#f43f5e" },
  { name: "✨ bonus +100 포인트!", shortName: "✨ +100 P", color1: "#fbbf24", color2: "#f59e0b", points: 100 },
  { name: "🎟️ 럭키드로우 경품 응모권", shortName: "🎟️ 경품 응모", color1: "#a855f7", color2: "#6366f1" },
  { name: "👑 황금 네온 후광 스킨", shortName: "👑 황금 후광", color1: "#f59e0b", color2: "#ec4899" },
  { name: "🍕 핑거푸드 무료 스낵 쿠폰", shortName: "🍕 무료 스낵", color1: "#34d399", color2: "#14b8a6" },
  { name: "⚡️ bonus +50 포인트!", shortName: "⚡️ +50 P", color1: "#22d3ee", color2: "#3b82f6", points: 50 },
];

export default function LuckyRouletteModal({
  isOpen,
  onClose,
  currentUser,
  onSpinSuccess,
}: LuckyRouletteModalProps) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<RouletteItem | null>(null);
  const [rotation, setRotation] = useState(0);

  if (!isOpen) return null;

  const cost = 50;
  const canSpin = currentUser && currentUser.points >= cost;

  const handleSpin = () => {
    if (!canSpin || spinning) return;

    setSpinning(true);
    setResult(null);

    // 6개 조각 (조각당 60도)
    const numItems = ROULETTE_ITEMS.length;
    const sliceAngle = 360 / numItems;
    const randomIndex = Math.floor(Math.random() * numItems);

    // 12시 방향 화살표에 당첨 항목의 중앙선이 오도록 보정
    // index i의 중앙선 각도는 i * 60 + 30 도
    const targetMidAngle = randomIndex * sliceAngle + sliceAngle / 2;
    const stopAngle = 360 - targetMidAngle;

    const newDegree = rotation + 1800 + (stopAngle - (rotation % 360));
    setRotation(newDegree);

    setTimeout(() => {
      setSpinning(false);
      const wonItem = ROULETTE_ITEMS[randomIndex];
      setResult(wonItem);
      triggerConfetti();
      onSpinSuccess(wonItem.name, wonItem.points);
    }, 3500);
  };

  // SVG 부채꼴 path 생성 유틸리티
  const getSlicePath = (index: number, total: number, radius: number) => {
    const angle = 360 / total;
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = radius + radius * Math.cos(startRad);
    const y1 = radius + radius * Math.sin(startRad);
    const x2 = radius + radius * Math.cos(endRad);
    const y2 = radius + radius * Math.sin(endRad);

    return `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
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
        <div className="relative w-64 h-64 mx-auto mb-5 my-2 flex items-center justify-center">
          {/* top 12시 방향 화살표 포인터 */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[20px] border-t-party-pink drop-shadow-xl" />

          {/* SVG 회전 원판 */}
          <div
            className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-purple-500/50 transition-all ease-out duration-[3500ms]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 240 240" className="w-full h-full">
              <defs>
                {ROULETTE_ITEMS.map((item, i) => (
                  <linearGradient key={i} id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={item.color1} />
                    <stop offset="100%" stopColor={item.color2} />
                  </linearGradient>
                ))}
              </defs>

              {/* 6개 파이 조각 렌더링 */}
              {ROULETTE_ITEMS.map((item, i) => (
                <path
                  key={i}
                  d={getSlicePath(i, 6, 120)}
                  fill={`url(#grad-${i})`}
                  stroke="#0F0C20"
                  strokeWidth="2"
                />
              ))}

              {/* 파이 조각 정중앙 텍스트 방사형 렌더링 */}
              {ROULETTE_ITEMS.map((item, i) => {
                const angle = 60 * i + 30; // 부채꼴 정중앙 각도
                const rad = ((angle - 90) * Math.PI) / 180;
                // 중심(120, 120)에서 반지름(120)의 약 62% 지점 (r = 75)
                const textX = 120 + 75 * Math.cos(rad);
                const textY = 120 + 75 * Math.sin(rad);

                return (
                  <text
                    key={i}
                    x={textX}
                    y={textY}
                    fill="#0F0C20"
                    fontSize="11"
                    fontWeight="900"
                    textAnchor="middle"
                    dominantBaseline="central"
                    transform={`rotate(${angle + 90}, ${textX}, ${textY})`}
                    className="select-none font-sans"
                  >
                    {item.shortName}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* 중앙 파티 뱃지 아이콘 */}
          <div className="absolute w-12 h-12 rounded-full bg-slate-950 border-2 border-purple-400 flex items-center justify-center text-lg z-20 shadow-2xl">
            🎰
          </div>
        </div>

        {/* 당첨 결과 알림 */}
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
