"use client";

import React, { useState } from "react";
import { PartyInfo, Quest, QuestType } from "@/types/party";
import { Settings, PlusCircle, Trash2, Edit3, Share2, Check, QrCode, Sparkles, Users, Award, ShieldAlert } from "lucide-react";
import { triggerConfetti } from "@/utils/confetti";

interface HostDashboardProps {
  partyInfo: PartyInfo;
  onUpdatePartyInfo: (info: PartyInfo) => void;
  quests: Quest[];
  onAddQuest: (quest: Omit<Quest, "id" | "completed">) => void;
  onDeleteQuest: (questId: string) => void;
  guestCount: number;
}

export default function HostDashboard({
  partyInfo,
  onUpdatePartyInfo,
  quests,
  onAddQuest,
  onDeleteQuest,
  guestCount,
}: HostDashboardProps) {
  // 파티 정보 수정 상태
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [name, setName] = useState(partyInfo.name);
  const [theme, setTheme] = useState(partyInfo.theme);
  const [announcement, setAnnouncement] = useState(partyInfo.announcement);

  // 퀘스트 추가 상태
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPoints, setNewPoints] = useState(70);
  const [newCategory, setNewCategory] = useState<Quest["category"]>("미션");
  const [newType, setNewType] = useState<QuestType>("click");
  const [error, setError] = useState("");

  // 링크 복사 토스트
  const [copied, setCopied] = useState(false);

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePartyInfo({
      ...partyInfo,
      name,
      theme,
      announcement,
    });
    setIsEditingInfo(false);
    triggerConfetti();
  };

  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) {
      setError("퀘스트 제목과 설명을 모두 입력해 주세요!");
      return;
    }

    onAddQuest({
      title: newTitle.trim(),
      description: newDesc.trim(),
      points: Number(newPoints),
      category: newCategory,
      type: newType,
    });

    setNewTitle("");
    setNewDesc("");
    setError("");
    triggerConfetti();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalCompletedQuests = quests.filter((q) => q.completed).length;

  return (
    <div className="space-y-6">
      {/* 헤더 배너 & 초대 공유 바 */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border border-purple-500/40 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Settings className="w-6 h-6 text-party-purple" />
              <h3 className="text-xl font-black text-white">호스트 파티 컨트롤 타워</h3>
            </div>
            <p className="text-xs text-slate-300">
              파티 정보를 업데이트하고 실시간으로 새로운 파티 미션을 추가할 수 있습니다.
            </p>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-gradient-to-r from-party-pink to-party-purple text-white rounded-xl text-xs font-bold shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "초대 링크 복사 완료!" : "파티 참가 초대 링크 복사"}</span>
          </button>
        </div>

        {/* 실시간 파티 통계 메트릭 */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-purple-500/20">
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">총 참가 게스트</span>
            <span className="text-xl font-black text-cyan-300">{guestCount}명</span>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">활성 퀘스트 수</span>
            <span className="text-xl font-black text-party-pink">{quests.length}개</span>
          </div>
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-3.5 text-center">
            <span className="text-[11px] text-slate-400 block font-semibold">내 완료 퀘스트</span>
            <span className="text-xl font-black text-amber-400">{totalCompletedQuests}개</span>
          </div>
        </div>
      </div>

      {/* 1. 파티 정보 수정 영역 */}
      <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-party-cyan" /> 파티 기본 정보 설정
          </h4>
          <button
            onClick={() => setIsEditingInfo(!isEditingInfo)}
            className="text-xs text-party-pink font-semibold hover:underline cursor-pointer"
          >
            {isEditingInfo ? "닫기" : "수정하기"}
          </button>
        </div>

        {isEditingInfo ? (
          <form onSubmit={handleSaveInfo} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">파티명</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">파티 테마</label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">실시간 공지사항</label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 bg-gradient-to-r from-party-purple to-party-pink text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
            >
              저장하기
            </button>
          </form>
        ) : (
          <div className="space-y-2 text-xs text-slate-300">
            <p><strong className="text-slate-400">파티명:</strong> {partyInfo.name}</p>
            <p><strong className="text-slate-400">테마:</strong> {partyInfo.theme}</p>
            <p><strong className="text-slate-400">공지:</strong> {partyInfo.announcement}</p>
          </div>
        )}
      </div>

      {/* 2. 새 퀘스트 추가 폼 */}
      <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 shadow-xl">
        <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <PlusCircle className="w-4 h-4 text-party-pink" /> 새 파티 퀘스트 생성
        </h4>
        <p className="text-xs text-slate-400 mb-4">
          현장 분위기에 맞춰 즉석 게릴라 미션을 만들어 참가자들에게 배부하세요!
        </p>

        <form onSubmit={handleCreateQuest} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">퀘스트 제목</label>
              <input
                type="text"
                placeholder="예: 호스트와 셀카 찍고 인스타 스토리 올리기 📸"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  setError("");
                }}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">지급 포인트</label>
              <input
                type="number"
                min={10}
                max={500}
                step={10}
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">퀘스트 상세 설명</label>
            <input
              type="text"
              placeholder="참가자가 수행해야 할 구체적인 행동을 적어주세요."
              value={newDesc}
              onChange={(e) => {
                setNewDesc(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none focus:border-party-pink"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">카테고리</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Quest["category"])}
                className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="아이스브레이킹">🤝 아이스브레이킹</option>
                <option value="스낵바">🍹 스낵바</option>
                <option value="미션">🎤 미션</option>
                <option value="소셜">💌 소셜</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">인증 방식</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as QuestType)}
                className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="click">원클릭 완료형</option>
                <option value="input">키워드/텍스트 입력형</option>
                <option value="check">체크리스트형</option>
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-party-purple via-party-pink to-party-cyan text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/25 hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>새 퀘스트 파티에 즉시 배부하기</span>
          </button>
        </form>
      </div>

      {/* 3. 퀘스트 목록 관리 및 삭제 */}
      <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 shadow-xl">
        <h4 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <span>📋 현재 활성화된 퀘스트 관리 ({quests.length}개)</span>
        </h4>

        <div className="space-y-2.5">
          {quests.map((q) => (
            <div
              key={q.id}
              className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                    {q.category}
                  </span>
                  <strong className="text-white truncate">{q.title}</strong>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{q.description}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-amber-400 font-bold">+{q.points}P</span>
                <button
                  onClick={() => onDeleteQuest(q.id)}
                  className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900/80 transition cursor-pointer"
                  title="퀘스트 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
