"use client";

import React, { useState } from "react";
import { PartyPopper, Sparkles, MapPin, Megaphone, Flame, User, X, QrCode, Copy, Check } from "lucide-react";

import { PartyRoom } from "@/types/party";
import { triggerConfetti } from "@/utils/confetti";
import { PRESET_QUESTS } from "@/data/presetQuests";
import { MOCK_GUESTS } from "@/data/mockGuests";

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPartyCreated: (newParty: PartyRoom) => void;
}

export default function CreatePartyModal({
  isOpen,
  onClose,
  onPartyCreated,
}: CreatePartyModalProps) {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState("AI, Tech & Music Gathering 🌴");
  const [location, setLocation] = useState("");
  const [announcement, setAnnouncement] = useState("📢 파티원들과 퀘스트를 풀고 즐거운 네트워킹을 시작하세요!");
  const [hostName, setHostName] = useState("");
  const [error, setError] = useState("");

  const [createdPartyResult, setCreatedPartyResult] = useState<PartyRoom | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("파티 이름을 입력해 주세요!");
      return;
    }
    if (!location.trim()) {
      setError("개최 장소를 입력해 주세요!");
      return;
    }
    if (!hostName.trim()) {
      setError("개최자/호스트 이름을 입력해 주세요!");
      return;
    }

    const partyId = "pq_custom_" + Date.now();
    const origin = typeof window !== "undefined" ? window.location.origin : "https://partyquest-app.vercel.app";
    const shareUrl = `${origin}/?partyId=${partyId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(shareUrl)}`;

    const newParty: PartyRoom = {
      id: partyId,
      name: name.trim(),
      theme: theme.trim(),
      location: location.trim(),
      announcement: announcement.trim(),
      hostName: hostName.trim(),
      qrUrl: qrUrl,
      bannerImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      createdAt: new Date().toLocaleDateString(),
      activeGuestsCount: 1,
      quests: PRESET_QUESTS,
      guests: MOCK_GUESTS.slice(0, 2),
      guestbook: [],
      photoFeed: [],
    };

    onPartyCreated(newParty);
    triggerConfetti();
    setCreatedPartyResult(newParty);
  };

  const handleCopyUrl = () => {
    if (!createdPartyResult) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "https://partyquest-app.vercel.app";
    const shareUrl = `${origin}/?partyId=${createdPartyResult.id}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetAndClose = () => {
    setName("");
    setLocation("");
    setHostName("");
    setCreatedPartyResult(null);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-party-card border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {createdPartyResult ? (
          /* 파티 개설 성공 후 QR코드 & 링크 공개 모달 */
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 text-2xl font-black shadow-lg shadow-emerald-500/30">
              🎉
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-block mb-2">
                이벤터스 파티 개설 완수!
              </span>
              <h3 className="text-xl font-black text-white">{createdPartyResult.name}</h3>
              <p className="text-xs text-slate-300 mt-1">
                아래 현장 전용 QR코드 및 초청 링크를 참가자들에게 공유하세요!
              </p>
            </div>

            {/* 현장 스캔 전용 QR코드 카드 */}
            <div className="bg-white text-slate-950 rounded-2xl p-5 shadow-xl max-w-xs mx-auto">
              <span className="text-[11px] font-black text-purple-900 block mb-2 tracking-widest uppercase">
                📱 PARITY ENTRY QR CODE
              </span>
              <img
                src={createdPartyResult.qrUrl}
                alt="파티 입장 QR"
                className="w-48 h-48 mx-auto rounded-xl border border-slate-200 shadow-md"
              />
              <p className="text-[10px] text-slate-500 mt-3 font-mono">
                호스트: {createdPartyResult.hostName} • 장소: {createdPartyResult.location}
              </p>
            </div>

            {/* 초청 링크 복사 폼 */}
            <div className="space-y-2">
              <button
                onClick={handleCopyUrl}
                className="w-full py-3 bg-gradient-to-r from-party-pink to-party-purple text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>파티 링크 복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>파티 초청 링크 복사하기</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-700 cursor-pointer"
              >
                개설한 파티로 즉시 입장하기 🚀
              </button>
            </div>
          </div>
        ) : (
          /* 파티 개최 정보 입력 폼 */
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2.5 bg-gradient-to-tr from-party-pink to-party-purple rounded-2xl text-white shadow-lg shadow-pink-500/20">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">🎉 나만의 파티/이벤트 개최하기</h3>
                <span className="text-[11px] text-purple-300 font-semibold">
                  이벤터스/Festa처럼 파티를 개설하고 현장 입장 QR코드를 자동 발급받으세요!
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  📌 파티/이벤트 이름 <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 2026 AI 해커톤 네트워크 파티 🍹"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  🌴 파티 컨셉 & 테마
                </label>
                <input
                  type="text"
                  placeholder="예: AI, Music & Tech Gathering"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    📍 개최 장소 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: 강남 파이낸스 센터 15F"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    👑 개최자/호스트 이름 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="예: Google Hackathon Team"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  📢 파티 공지사항 & 안내
                </label>
                <textarea
                  rows={2}
                  placeholder="파티원들에게 알릴 주요 공지나 웰컴 메시지를 적어주세요!"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-700 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-party-pink to-party-purple text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>파티 생성 & QR 발급받기 🚀</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
