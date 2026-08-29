"use client";

import React, { useState } from "react";
import { UserProfile, RewardItem } from "@/types/party";
import { Gift, Award, CheckCircle, Sparkles, QrCode, ArrowRight, X } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";

interface RewardStoreProps {
  currentUser: UserProfile | null;
  rewards: RewardItem[];
  onRedeemReward: (reward: RewardItem) => void;
  onOpenOnboarding: () => void;
}

export default function RewardStore({
  currentUser,
  rewards,
  onRedeemReward,
  onOpenOnboarding,
}: RewardStoreProps) {
  const [activeCoupon, setActiveCoupon] = useState<{
    reward: RewardItem;
    issuedAt: string;
  } | null>(null);

  const handleRedeem = (reward: RewardItem) => {
    if (!currentUser) {
      onOpenOnboarding();
      return;
    }
    if (currentUser.points < reward.pointsRequired) return;

    onRedeemReward(reward);
    triggerConfetti();
    setActiveCoupon({
      reward,
      issuedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
  };

  const userPoints = currentUser?.points || 0;

  return (
    <div className="space-y-6">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-purple-950/70 to-slate-900/80 border border-cyan-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-black text-white">파티 리워드 교환소</h3>
          </div>
          <p className="text-xs text-slate-300">
            퀘스트로 획득한 포인트로 스낵바 음료권과 파티 경품을 즉시 교환하세요!
          </p>
        </div>

        {/* 현재 포인트 */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-cyan-500/40 rounded-2xl shadow-lg">
          <Award className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">내 사용 가능 포인트</span>
            <span className="text-lg font-black text-cyan-300">{userPoints} P</span>
          </div>
        </div>
      </div>

      {/* 리워드 아이템 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map((reward) => {
          const canAfford = userPoints >= reward.pointsRequired;

          return (
            <div
              key={reward.id}
              className={`relative overflow-hidden rounded-2xl border p-5 transition duration-200 flex flex-col justify-between ${
                canAfford
                  ? "bg-party-card border-cyan-500/40 hover:border-cyan-400 shadow-lg shadow-cyan-950/30"
                  : "bg-slate-900/60 border-slate-800 opacity-75"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="text-3xl p-2.5 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
                    {reward.icon}
                  </div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    {reward.pointsRequired} P
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1.5">
                  {reward.title}
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {reward.description}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-medium">
                  잔여 수량: <strong className="text-slate-200">{reward.availableCount}개</strong>
                </span>

                <button
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford && !!currentUser}
                  className={`py-2 px-4 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    canAfford
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 active:scale-95 text-slate-950 font-black shadow-md shadow-cyan-500/25"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                  }`}
                >
                  {canAfford ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>교환하기</span>
                    </>
                  ) : (
                    <span>포인트 부족 ({reward.pointsRequired - userPoints}P 필요)</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 모바일 교환 쿠폰 바코드 팝업 모달 */}
      {activeCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-sm bg-party-card border border-cyan-500/50 rounded-3xl p-6 shadow-2xl text-center text-slate-100">
            <button
              onClick={() => setActiveCoupon(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-4xl mb-2">{activeCoupon.reward.icon}</div>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              쿠폰 발급 완료
            </span>

            <h4 className="text-lg font-bold text-white mb-1">
              {activeCoupon.reward.title}
            </h4>
            <p className="text-xs text-slate-300 mb-6">
              스태프/바텐더에게 아래 바코드를 보여주세요!
            </p>

            {/* 바코드 UI 카드 */}
            <div className="bg-white text-slate-950 rounded-2xl p-5 mb-4 shadow-xl">
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <QrCode className="w-5 h-5 text-slate-800" />
                <span className="text-xs font-black tracking-widest uppercase">
                  {activeCoupon.reward.couponCode}
                </span>
              </div>

              {/* 바코드 선 그래픽 */}
              <div className="h-14 flex items-center justify-center gap-1 overflow-hidden">
                {[4, 2, 6, 2, 4, 8, 2, 6, 3, 5, 2, 7, 3, 6, 2, 4, 8, 3, 5, 2, 4, 6, 2].map((w, i) => (
                  <div
                    key={i}
                    className="bg-black h-full"
                    style={{ width: `${w}px` }}
                  />
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                발급 시간: {activeCoupon.issuedAt}
              </p>
            </div>

            <button
              onClick={() => setActiveCoupon(null)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              확인 완료
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
