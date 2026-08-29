"use client";

import React, { useState } from "react";
import { Quest, QuestSubmission, UserProfile } from "@/types/party";
import { CheckCircle2, Award, ArrowRight, Camera, ShieldAlert, Clock, Check, X, User } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  currentUser: UserProfile | null;
  onComplete: (questId: string, answer?: string, photoUrl?: string) => void;
  onSubmitForApproval?: (questId: string, photoUrl?: string, answerText?: string) => void;
  onApproveSubmission?: (questId: string, submissionId: string) => void;
  onRejectSubmission?: (questId: string, submissionId: string) => void;
  onNavigateSocial?: () => void;
}

export default function QuestCard({
  quest,
  currentUser,
  onComplete,
  onSubmitForApproval,
  onApproveSubmission,
  onRejectSubmission,
  onNavigateSocial,
}: QuestCardProps) {
  const [inputText, setInputText] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showApprovalPanel, setShowApprovalPanel] = useState(false);
  const [error, setError] = useState("");

  const isCompleted = quest.completed;
  const isCreator = currentUser && (currentUser.id === quest.creatorId || currentUser.nickname === "PartyHost");

  // 내 대기 중인 제출물 확인
  const myPendingSubmission = quest.pendingSubmissions?.find(
    (s) => currentUser && s.userId === currentUser.id && s.status === "pending"
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quest.type === "photo" && !photoPreview) {
      setError("인증 사진을 첨부해 주세요!");
      return;
    }

    if (quest.type === "input" && !inputText.trim()) {
      setError("정답 키워드/텍스트를 입력해 주세요!");
      return;
    }

    // 생성자 승인 필요 시
    if (quest.requiresApproval && onSubmitForApproval) {
      onSubmitForApproval(quest.id, photoPreview || undefined, inputText.trim() || undefined);
      setPhotoPreview(null);
      setInputText("");
      setError("");
      return;
    }

    // 즉시 완료
    onComplete(quest.id, inputText.trim() || undefined, photoPreview || undefined);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition duration-200 flex flex-col justify-between ${
        isCompleted
          ? "bg-slate-900/60 border-slate-800 opacity-80"
          : quest.category === "유저현상금"
          ? "bg-party-card border-amber-500/40 hover:border-amber-400 shadow-lg shadow-amber-950/20"
          : "bg-party-card border-purple-500/20 hover:border-purple-500/50 shadow-md shadow-purple-950/20"
      }`}
    >
      <div>
        {/* 상단 뱃지 & 포인트 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                quest.category === "아이스브레이킹"
                  ? "bg-pink-950/60 text-pink-300 border-pink-500/30"
                  : quest.category === "스낵바"
                  ? "bg-cyan-950/60 text-cyan-300 border-cyan-500/30"
                  : quest.category === "유저현상금"
                  ? "bg-amber-950/60 text-amber-300 border-amber-500/30"
                  : "bg-purple-950/60 text-purple-300 border-purple-500/30"
              }`}
            >
              {quest.category}
            </span>

            {quest.creatorName && (
              <span className="text-[10px] text-slate-400 font-medium">
                by {quest.creatorName}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>+{quest.points} P</span>
          </div>
        </div>

        <h4 className="text-base font-bold text-white mb-1">{quest.title}</h4>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
          {quest.description}
        </p>

        {/* 사진 인증 등록 이미지 미리보기 */}
        {photoPreview && (
          <div className="mb-3 relative rounded-xl overflow-hidden border border-purple-500/40 bg-slate-950 p-2">
            <img src={photoPreview} alt="인증 사진 미리보기" className="w-full h-36 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => setPhotoPreview(null)}
              className="absolute top-3 right-3 p-1 rounded-full bg-black/70 text-white hover:bg-rose-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 완료/인증 하단 액션 바 */}
      <div>
        {isCompleted ? (
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-2.5 rounded-xl">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> 미션 달성 완료!
            </span>
            <span className="text-[10px] text-slate-400">{quest.userAnswer || "성공"}</span>
          </div>
        ) : myPendingSubmission ? (
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold bg-amber-950/40 border border-amber-500/30 px-3.5 py-2.5 rounded-xl">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 animate-spin text-amber-400" /> 생성자 검증 승인 대기 중...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2">
            {/* 사진 인증 업로드 버튼 */}
            {quest.type === "photo" && (
              <div className="flex items-center gap-2">
                <label className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 rounded-xl text-xs text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition">
                  <Camera className="w-4 h-4 text-party-pink" />
                  <span>{photoPreview ? "사진 다시 선택" : "📸 인증 사진 파일 선택"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* 텍스트 입력 */}
            {quest.type === "input" && (
              <input
                type="text"
                placeholder={quest.inputPlaceholder || "정답 키워드 입력"}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setError("");
                }}
                className="w-full px-3.5 py-2 bg-slate-900 border border-purple-500/30 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-party-pink"
              />
            )}

            {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-party-pink via-party-purple to-party-cyan hover:opacity-90 active:scale-95 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{quest.requiresApproval ? "생성자에게 인증 사진 제출하기 🚀" : "미션 완료 인증하기"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* 생성자/호스트 관리 패널 (대기 제출물 검토) */}
        {isCreator && quest.pendingSubmissions && quest.pendingSubmissions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <button
              onClick={() => setShowApprovalPanel(!showApprovalPanel)}
              className="w-full py-1.5 px-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer"
            >
              <span>🔍 대기 중인 인증 {quest.pendingSubmissions.length}건 검토</span>
              <span>{showApprovalPanel ? "▲ 닫기" : "▼ 열기"}</span>
            </button>

            {showApprovalPanel && (
              <div className="mt-2 space-y-2">
                {quest.pendingSubmissions.map((sub) => (
                  <div key={sub.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white flex items-center gap-1">
                        <User className="w-3 h-3 text-party-pink" /> {sub.userName}
                      </span>
                      <span className="text-[10px] text-slate-500">{sub.submittedAt}</span>
                    </div>

                    {sub.photoUrl && (
                      <img src={sub.photoUrl} alt="제출 사진" className="w-full h-28 object-cover rounded-lg mb-2" />
                    )}

                    {sub.answerText && <p className="text-slate-300 text-[11px] mb-2">"{sub.answerText}"</p>}

                    <div className="flex gap-2">
                      <button
                        onClick={() => onApproveSubmission && onApproveSubmission(quest.id, sub.id)}
                        className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> 승인 (+{quest.points}P)
                      </button>
                      <button
                        onClick={() => onRejectSubmission && onRejectSubmission(quest.id, sub.id)}
                        className="flex-1 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1"
                      >
                        <X className="w-3 h-3" /> 거절
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
