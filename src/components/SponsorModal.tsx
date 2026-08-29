"use client";

import React, { useState } from "react";
import { HeartHandshake, Sparkles, Crown, X, Heart, Award } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { UserProfile } from "@/types/party";

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onSponsorSuccess: (amount: number, message: string) => void;
  onOpenOnboarding: () => void;
}

export default function SponsorModal({
  isOpen,
  onClose,
  currentUser,
  onSponsorSuccess,
  onOpenOnboarding,
}: SponsorModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(10000);
  const [sponsorMsg, setSponsorMsg] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenOnboarding();
      return;
    }
    if (!sponsorMsg.trim()) {
      setError("파티 응원 메시지를 입력해 주세요!");
      return;
    }

    onSponsorSuccess(selectedAmount, sponsorMsg.trim());
    triggerConfetti();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-party-card border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-center text-slate-100 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/30">
          <Crown className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-black text-white mb-1">
          파티 후원 & 스폰서십
        </h3>
        <p className="text-xs text-slate-300 mb-5">
          파티 활성화를 위해 후원해 주시면 <strong className="text-amber-300">👑 SPONSOR 뱃지</strong>와 <strong className="text-amber-300">+150P</strong> 보너스를 드립니다!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 후원 금액 선택 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">후원 항목/금액 선택</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "🍹 음료 5잔", amt: 10000 },
                { label: "🍕 스낵 세트", amt: 25000 },
                { label: "👑 메인 후원", amt: 50000 },
              ].map((item) => (
                <button
                  key={item.amt}
                  type="button"
                  onClick={() => setSelectedAmount(item.amt)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                    selectedAmount === item.amt
                      ? "bg-amber-500/30 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  <div>{item.label}</div>
                  <div className="text-[10px] opacity-80">{item.amt.toLocaleString()}원</div>
                </button>
              ))}
            </div>
          </div>

          {/* 한 줄 후원 응원 메시지 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">스폰서 응원 메시지</label>
            <input
              type="text"
              placeholder="예: 2026 I/O Extended 대박 나세요! 맛있는 음료 후원합니다 🔥"
              value={sponsorMsg}
              onChange={(e) => {
                setSponsorMsg(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-amber-500/30 focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            {error && <p className="text-[11px] text-rose-400 font-medium mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:opacity-90 active:scale-95 text-slate-950 font-black rounded-2xl text-xs shadow-lg shadow-amber-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Heart className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>{selectedAmount.toLocaleString()}원 파티 후원하기</span>
          </button>
        </form>
      </div>
    </div>
  );
}
