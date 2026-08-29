"use client";

import React, { useState } from "react";
import { Sparkles, PartyPopper, User, ArrowRight, Instagram, Linkedin, Tag } from "lucide-react";
import { UserProfile, UserRole } from "@/types/party";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
}

const ROLES: UserRole[] = [
  "💻 개발자",
  "🎨 디자이너",
  "🎉 파티러버",
  "👔 기획/PM",
  "🚀 창업가",
  "🎵 DJ/음악",
];

const AVATAR_COLORS = [
  "from-pink-500 to-rose-500",
  "from-purple-500 to-indigo-500",
  "from-cyan-500 to-blue-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
  "from-fuchsia-500 to-purple-600",
];

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState<UserRole>("💻 개발자");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("닉네임을 입력해 주세요!");
      return;
    }

    const newUser: UserProfile = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      nickname: nickname.trim(),
      role,
      bio: bio.trim() || "파티를 즐기러 온 게스트입니다! 🎉",
      instagram: instagram.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      points: 0,
      completedQuestIds: [],
      joinedAt: new Date().toISOString(),
      avatarColor: selectedColor,
    };

    localStorage.setItem("partyquest_user", JSON.stringify(newUser));
    onComplete(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-party-card border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-900/40 text-slate-100 overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-party-pink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-party-purple/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-tr from-party-pink to-party-purple rounded-xl text-white shadow-lg shadow-pink-500/30">
              <PartyPopper className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-200 bg-clip-text text-transparent">
                PartyQuest 입장하기
              </h2>
              <p className="text-xs text-slate-400">3초 만에 프로필을 만들고 퀘스트를 시작하세요</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-party-cyan" /> 닉네임 <span className="text-party-pink">*</span>
              </label>
              <input
                type="text"
                placeholder="예: 네온댄서, 코딩마스터"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 bg-slate-900/80 border border-purple-500/30 focus:border-party-pink rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-party-pink/20 transition"
                autoFocus
              />
              {error && <p className="text-xs text-rose-400 mt-1 font-medium">{error}</p>}
            </div>

            {/* 역할 선택 */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-party-amber" /> 오늘 나의 역할 / 키워드
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-xl border transition text-center truncate ${
                      role === r
                        ? "bg-party-purple/40 border-party-pink text-white shadow-md shadow-purple-500/20 font-bold"
                        : "bg-slate-900/40 border-slate-700/60 text-slate-300 hover:border-slate-500"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* 한 줄 소개 */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-1.5">
                한 줄 소개 (아이스브레이킹용)
              </label>
              <input
                type="text"
                placeholder="예: 클라우드와 파티 음악에 진심인 프론트엔드입니다!"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-900/80 border border-purple-500/30 focus:border-party-cyan rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-party-cyan/20 transition text-sm"
              />
            </div>

            {/* SNS 정보 */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> 인스타그램 (선택)
                </label>
                <input
                  type="text"
                  placeholder="@id"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-party-pink"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400" /> 링크드인 (선택)
                </label>
                <input
                  type="text"
                  placeholder="아이디 또는 URL"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/60 border border-slate-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-party-cyan"
                />
              </div>
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              className="w-full mt-4 py-3.5 px-6 bg-gradient-to-r from-party-purple via-party-pink to-party-cyan hover:opacity-90 active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 transition duration-150 cursor-pointer"
            >
              <span>파티 퀘스트 입장하기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
