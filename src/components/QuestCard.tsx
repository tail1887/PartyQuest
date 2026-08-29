"use client";

import React, { useState } from "react";
import { Quest, UserProfile } from "@/types/party";
import { CheckCircle2, Award, ArrowRight, Camera, Upload, ShieldCheck, Clock, X, AlertCircle } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  currentUser?: UserProfile | null;
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
  const [inputValue, setInputValue] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능합니다!");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoUrl(reader.result as string);
      setIsUploading(false);
      setError("");
    };
    reader.onerror = () => {
      setError("사진 파일 읽기에 실패했습니다.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAction = () => {
    if (quest.type === "input") {
      if (!inputValue.trim()) {
        setError("인증 답변을 입력해 주세요!");
        return;
      }
      onComplete(quest.id, inputValue.trim(), photoUrl);
      return;
    }

    if (quest.type === "photo") {
      if (!photoUrl) {
        setError("📸 실제 인증 사진을 업로드해 주세요!");
        return;
      }

      if (quest.requiresApproval && onSubmitForApproval) {
        onSubmitForApproval(quest.id, photoUrl, inputValue.trim());
        setPhotoUrl(undefined);
        setInputValue("");
        return;
      }

      onComplete(quest.id, inputValue.trim() || quest.title, photoUrl);
      return;
    }

    if (quest.type === "social" && onNavigateSocial) {
      onNavigateSocial();
      return;
    }

    onComplete(quest.id, undefined, photoUrl);
  };

  const pendingCount = quest.pendingSubmissions?.length || 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 transition duration-200 flex flex-col justify-between ${
        quest.completed
          ? "bg-slate-900/60 border-slate-800 text-slate-400"
          : "bg-party-card border-purple-500/30 hover:border-purple-500/60 text-slate-100 shadow-xl shadow-purple-950/20"
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                quest.category === "유저현상금"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-purple-950/60 text-purple-300 border-purple-500/20"
              }`}
            >
              {quest.category}
            </span>

            {quest.requiresApproval && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-party-pink" /> 생성자 검증 필요
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 font-black text-amber-400 text-sm">
            <Award className="w-4 h-4" />
            <span>+{quest.points} P</span>
          </div>
        </div>

        <h4
          className={`text-base font-bold mb-1.5 ${
            quest.completed ? "line-through text-slate-400" : "text-white"
          }`}
        >
          {quest.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {quest.description}
        </p>

        {!quest.completed && (quest.type === "photo" || quest.requiresApproval) && (
          <div className="mb-3 p-3 bg-slate-900/90 rounded-xl border border-purple-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-party-pink" />
                <span>📸 실제 인증 사진 선택 (카메라/갤러리)</span>
              </label>
              {photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="text-[10px] text-rose-400 font-bold hover:underline"
                >
                  사진 삭제
                </button>
              )}
            </div>

            {photoUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-purple-500/40">
                <img
                  src={photoUrl}
                  alt="인증 미리보기"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 bg-black/70 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  ✓ 사진 첨부됨
                </span>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-purple-500/30 hover:border-party-pink/60 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition">
                <Upload className="w-6 h-6 text-party-pink mb-1 animate-bounce" />
                <span className="text-xs font-bold text-slate-300">
                  {isUploading ? "사진 변환 중..." : "클릭하여 사진 파일 올리기"}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  (JPG, PNG, GIF 지원)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {!quest.completed && (quest.type === "input" || (quest.type === "photo" && photoUrl)) && (
          <div className="mb-3">
            <input
              type="text"
              placeholder={quest.inputPlaceholder || "인증 한줄 설명이나 닉네임을 적어주세요!"}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-400 font-medium mb-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-purple-500/10 flex items-center justify-between gap-2">
        {quest.completed ? (
          <div className="w-full py-2 px-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>완수 완료 ({quest.points}P 획득)</span>
          </div>
        ) : (
          <button
            onClick={handleAction}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-party-pink via-purple-600 to-party-purple hover:opacity-90 active:scale-95 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-pink-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {quest.type === "social" ? (
              <>
                <span>방명록 이동하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : quest.requiresApproval ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>사진 인증 제출하여 승인 신청하기</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>실제 인증 완료하기 (+{quest.points}P)</span>
              </>
            )}
          </button>
        )}
      </div>

      {pendingCount > 0 && onApproveSubmission && onRejectSubmission && (
        <div className="mt-4 pt-3 border-t border-amber-500/30 bg-amber-950/20 -mx-5 -mb-5 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>🔍 대기 중인 인증 {pendingCount}건 검토</span>
            </span>
          </div>

          <div className="space-y-2">
            {quest.pendingSubmissions?.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-xs space-y-2"
              >
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-white">신청자: {sub.userName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{sub.submittedAt}</span>
                </div>

                {sub.photoUrl && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-slate-700">
                    <img
                      src={sub.photoUrl}
                      alt="제출 사진"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {sub.answerText && (
                  <p className="text-[11px] text-slate-300 bg-slate-950 p-2 rounded-md">
                    "{sub.answerText}"
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onApproveSubmission(quest.id, sub.id)}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg cursor-pointer"
                  >
                    ✅ 승인 (+{quest.points}P 지급)
                  </button>
                  <button
                    onClick={() => onRejectSubmission(quest.id, sub.id)}
                    className="flex-1 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-300 font-bold text-[11px] rounded-lg cursor-pointer"
                  >
                    ❌ 거절
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
