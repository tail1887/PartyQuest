"use client";

import React, { useState } from "react";
import { Sparkles, PlusCircle, ShieldCheck, Camera, CheckSquare, Zap, X, Coins } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";
import { UserProfile, Quest, QuestType } from "@/types/party";

interface CreateQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAddUserQuest: (quest: Omit<Quest, "id" | "completed">, bountyCost: number) => void;
  onOpenOnboarding: () => void;
}

export default function CreateQuestModal({
  isOpen,
  onClose,
  currentUser,
  onAddUserQuest,
  onOpenOnboarding,
}: CreateQuestModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bountyPoints, setBountyPoints] = useState(50);
  const [questType, setQuestType] = useState<QuestType>("photo");
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const userPoints = currentUser?.points || 0;
  const canAfford = currentUser && userPoints >= bountyPoints;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenOnboarding();
      return;
    }
    if (!title.trim() || !description.trim()) {
      setError("퀘스트 제목과 상세 설명을 모두 입력해 주세요!");
      return;
    }
    if (!canAfford) {
      setError(`포인트가 부족합니다! (현재: ${userPoints}P / 필요: ${bountyPoints}P)`);
      return;
    }

    onAddUserQuest(
      {
        title: title.trim(),
        description: description.trim(),
        points: bountyPoints,
        category: "유저현상금",
        type: questType,
        creatorId: currentUser.id,
        creatorName: currentUser.nickname,
        requiresApproval: requiresApproval,
        pendingSubmissions: [],
      },
      bountyPoints
    );

    triggerConfetti();
    setTitle("");
    setDescription("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-party-card border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2.5 bg-gradient-to-tr from-party-pink to-party-purple rounded-2xl text-white shadow-lg">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">나만의 포인트 현상금 퀘스트 만들기</h3>
            <span className="text-[10px] text-party-pink font-semibold">
              내 포인트를 걸고 참가자들에게 퀘스트를 제안해 보세요!
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* 제목 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">퀘스트 미션 제목</label>
            <input
              type="text"
              placeholder="예: 저(민지_Dev)와 함께 네온 아바타 셀카 찍기 📸"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">미션 상세 수행 방법</label>
            <textarea
              rows={2}
              placeholder="참가자가 어떻게 미션을 완수해야 하는지 적어주세요."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* 현상금 포인트 및 인증 방식 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">내걸 현상금 포인트</label>
              <select
                value={bountyPoints}
                onChange={(e) => setBountyPoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-amber-300 font-bold focus:outline-none"
              >
                <option value={30}>30 P 현상금</option>
                <option value={50}>50 P 현상금</option>
                <option value={100}>100 P 현상금</option>
                <option value={150}>150 P 현상금</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">인증 방식</label>
              <select
                value={questType}
                onChange={(e) => setQuestType(e.target.value as QuestType)}
                className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="photo">📸 사진 업로드 인증</option>
                <option value="input">✍️ 키워드/텍스트 인증</option>
                <option value="click">👆 원클릭 바로 인증</option>
              </select>
            </div>
          </div>

          {/* 생성자 직접 승인 필요 여부 토글 */}
          <div className="p-3 bg-slate-900/90 border border-purple-500/30 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-party-cyan" />
              <div>
                <span className="text-xs font-bold text-white block">생성자 확인/승인 필요</span>
                <span className="text-[10px] text-slate-400">
                  내가 직접 인증 사진/내용을 보고 포인트를 지급합니다.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={requiresApproval}
              onChange={(e) => setRequiresApproval(e.target.checked)}
              className="w-5 h-5 accent-party-pink cursor-pointer"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={!canAfford}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
              canAfford
                ? "bg-gradient-to-r from-party-pink via-party-purple to-party-cyan text-white shadow-pink-500/30 hover:opacity-90 active:scale-95"
                : "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
            }`}
          >
            <Coins className="w-4 h-4 text-amber-300" />
            <span>{bountyPoints} P 예치하고 현상금 퀘스트 생성하기</span>
          </button>
        </form>
      </div>
    </div>
  );
}
