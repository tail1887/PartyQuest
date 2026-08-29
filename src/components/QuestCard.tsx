"use client";

import React, { useState } from "react";
import { Quest } from "@/types/party";
import { CheckCircle2, Award, ArrowRight, Sparkles, Send, Flame } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  onComplete: (questId: string, answer?: string) => void;
  onNavigateSocial?: () => void;
}

export default function QuestCard({ quest, onComplete, onNavigateSocial }: QuestCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError("답변 내용을 입력해 주세요!");
      return;
    }
    onComplete(quest.id, inputValue.trim());
    setInputValue("");
    setError("");
  };

  const getCategoryColor = (category: Quest["category"]) => {
    switch (category) {
      case "아이스브레이킹":
        return "bg-pink-500/20 text-pink-300 border-pink-500/30";
      case "스낵바":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "미션":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "소셜":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition duration-200 p-5 ${
        quest.completed
          ? "bg-slate-900/80 border-emerald-500/40 shadow-lg shadow-emerald-950/30"
          : "bg-party-card border-purple-500/20 hover:border-purple-500/50 shadow-md shadow-purple-950/20"
      }`}
    >
      {/* 완료 상태 워터마크 */}
      {quest.completed && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-in fade-in duration-150">
          <CheckCircle2 className="w-3.5 h-3.5" /> 완료됨
        </div>
      )}

      {/* 카테고리 & 포인트 뱃지 */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getCategoryColor(quest.category)}`}>
          {quest.category}
        </span>
        <span className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
          <Award className="w-3.5 h-3.5" /> +{quest.points} P
        </span>
      </div>

      {/* 제목 및 설명 */}
      <h4 className={`text-base font-bold mb-1.5 ${quest.completed ? "text-slate-300 line-through decoration-slate-500" : "text-white"}`}>
        {quest.title}
      </h4>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        {quest.description}
      </p>

      {/* 내가 작성한 답변 표시 (완료된 경우) */}
      {quest.completed && quest.userAnswer && (
        <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
          <span className="text-slate-500 font-semibold mr-1.5">내 인증 내용:</span>
          <span className="italic text-cyan-300">"{quest.userAnswer}"</span>
        </div>
      )}

      {/* 미완료 시 인터랙션 컨트롤 */}
      {!quest.completed && (
        <div className="pt-2 border-t border-purple-500/10">
          {quest.type === "input" && (
            <form onSubmit={handleInputSubmit} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={quest.inputPlaceholder || "내용을 입력해 주세요..."}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError("");
                  }}
                  className="flex-1 px-3.5 py-2 bg-slate-900/90 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-party-pink to-party-purple text-white text-xs font-bold rounded-xl shadow-md shadow-pink-500/20 hover:opacity-90 active:scale-95 transition flex items-center gap-1 whitespace-nowrap cursor-pointer"
                >
                  <span>인증</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
              {error && <p className="text-[11px] text-rose-400 font-medium">{error}</p>}
            </form>
          )}

          {quest.type === "click" && (
            <button
              onClick={() => onComplete(quest.id)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-party-purple to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>미션 완료 인증하기</span>
            </button>
          )}

          {quest.type === "check" && (
            <button
              onClick={() => onComplete(quest.id)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-300" />
              <span>30초 자기소개 완료!</span>
            </button>
          )}

          {quest.type === "social" && (
            <button
              onClick={() => {
                if (onNavigateSocial) onNavigateSocial();
                else onComplete(quest.id);
              }}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold active:scale-[0.98] transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>네트워킹 월로 이동하여 남기기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
