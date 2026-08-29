"use client";

import React, { useState } from "react";
import { UserProfile, GuestbookEntry, PhotoFeedEntry } from "@/types/party";
import { Users, MessageSquare, Send, Instagram, Linkedin, Sparkles, Camera, Heart, Flame, ThumbsUp, PartyPopper } from "lucide-react";

interface NetworkingWallProps {
  currentUser: UserProfile | null;
  guests: UserProfile[];
  guestbook: GuestbookEntry[];
  photoFeed: PhotoFeedEntry[];
  onAddGuestbookEntry: (entry: Omit<GuestbookEntry, "id" | "createdAt">) => void;
  onReactPhotoFeed?: (feedId: string, sticker: string) => void;
  onOpenOnboarding: () => void;
}

const STICKERS = ["🎉", "💖", "🔥", "🤝", "🚀", "☕️", "🍕", "✨"];
const REACTION_STICKERS = ["🔥", "🎉", "💖", "🍹", "👏"];

export default function NetworkingWall({
  currentUser,
  guests,
  guestbook,
  photoFeed,
  onAddGuestbookEntry,
  onReactPhotoFeed,
  onOpenOnboarding,
}: NetworkingWallProps) {
  const [selectedGuest, setSelectedGuest] = useState<UserProfile | null>(null);
  const [selectedSticker, setSelectedSticker] = useState("🎉");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"GUESTS" | "PHOTO_FEED" | "GUESTBOOK">("PHOTO_FEED");

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenOnboarding();
      return;
    }
    if (!message.trim()) {
      setError("메시지 내용을 입력해 주세요!");
      return;
    }

    onAddGuestbookEntry({
      fromUser: currentUser.nickname,
      fromRole: currentUser.role,
      toUserId: selectedGuest ? selectedGuest.id : undefined,
      message: message.trim(),
      sticker: selectedSticker,
    });

    setMessage("");
    setError("");
    setSelectedGuest(null);
    setActiveTab("GUESTBOOK");
  };

  return (
    <div className="space-y-6">
      {/* 서브 탭 (참가자 / 📸 퀘스트 인증샷 피드 / 💌 파티 방명록) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-purple-500/20 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🤝 파티 소셜 커뮤니티 월
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            참가자들의 생생한 퀘스트 인증샷을 구경하고 응원 스티커를 남겨보세요!
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-purple-500/30 rounded-2xl overflow-x-auto no-scrollbar w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("PHOTO_FEED")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "PHOTO_FEED"
                ? "bg-gradient-to-r from-party-pink to-purple-600 text-white shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📸 인증샷 피드 ({photoFeed.length})
          </button>

          <button
            onClick={() => setActiveTab("GUESTS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "GUESTS"
                ? "bg-party-pink text-white shadow-md shadow-pink-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            👥 참가자 ({guests.length}명)
          </button>

          <button
            onClick={() => setActiveTab("GUESTBOOK")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === "GUESTBOOK"
                ? "bg-party-purple text-white shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💌 방명록 ({guestbook.length})
          </button>
        </div>
      </div>

      {/* 1. 📸 파티 퀘스트 인증샷 피드 뷰 */}
      {activeTab === "PHOTO_FEED" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {photoFeed.map((item) => (
            <div
              key={item.id}
              className="bg-party-card border border-purple-500/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-purple-500/60 transition"
            >
              <div>
                {/* 상단 프로필 정보 & 시간 */}
                <div className="p-3.5 flex items-center justify-between border-b border-purple-500/10 bg-slate-900/60">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-party-pink to-party-purple flex items-center justify-center text-white text-xs font-black shadow-md">
                      {item.userName.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{item.userName}</span>
                      </h4>
                      <span className="text-[10px] text-slate-400">{item.userRole}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.createdAt}</span>
                </div>

                {/* 인증 이미지 & 퀘스트 뱃지 */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.questTitle}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                    🎯 {item.questTitle}
                  </span>
                </div>

                {/* 캡션 */}
                {item.caption && (
                  <p className="p-3.5 text-xs text-slate-200 leading-relaxed">
                    "{item.caption}"
                  </p>
                )}
              </div>

              {/* 하단 스티커 리액션 버튼 */}
              <div className="p-3 border-t border-purple-500/10 bg-slate-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {REACTION_STICKERS.map((stk) => {
                  const count = item.reactions[stk] || 0;
                  return (
                    <button
                      key={stk}
                      onClick={() => onReactPhotoFeed && onReactPhotoFeed(item.id, stk)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
                    >
                      <span>{stk}</span>
                      <span className="text-[10px] text-purple-300 font-mono">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. 참가자 카드 목록 뷰 */}
      {activeTab === "GUESTS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guests.map((guest) => {
            const isMe = currentUser?.id === guest.id;
            return (
              <div
                key={guest.id}
                className={`relative bg-party-card border rounded-2xl p-5 transition duration-200 flex flex-col justify-between ${
                  isMe
                    ? "border-party-pink/60 shadow-lg shadow-pink-950/40 ring-1 ring-party-pink/40"
                    : "border-purple-500/20 hover:border-purple-500/50 shadow-md shadow-purple-950/20"
                }`}
              >
                {isMe && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-party-pink/20 text-party-pink border border-party-pink/40 text-[10px] font-bold">
                    MY PROFILE
                  </span>
                )}

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${guest.avatarColor} flex items-center justify-center text-white text-lg font-black shadow-lg shadow-purple-500/20`}>
                      {guest.nickname.slice(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{guest.nickname}</span>
                      </h4>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700 text-[10px] font-medium">
                        {guest.role}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                    "{guest.bio}"
                  </p>
                </div>

                <div>
                  {/* SNS 링크 */}
                  <div className="flex items-center gap-2 mb-3">
                    {guest.instagram && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded-md border border-pink-500/20">
                        <Instagram className="w-3 h-3" /> @{guest.instagram}
                      </span>
                    )}
                    {guest.linkedin && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded-md border border-blue-500/20">
                        <Linkedin className="w-3 h-3" /> {guest.linkedin}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedGuest(guest)}
                    className="w-full py-2 px-3 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-600/50 hover:to-pink-600/50 border border-purple-500/40 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-party-pink" />
                    <span>응원 메시지 & 스티커 남기기</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. 실시간 파티 방명록 피드 뷰 */}
      {activeTab === "GUESTBOOK" && (
        <div className="space-y-6">
          {/* 방명록 작성 폼 */}
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-5 shadow-xl">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-party-pink" /> 전체 파티 방명록 남기기
            </h4>

            {/* 스티커 선택 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-3">
              {STICKERS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => setSelectedSticker(stk)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                    selectedSticker === stk
                      ? "bg-party-purple/40 border-2 border-party-pink scale-110 shadow-md shadow-purple-500/30"
                      : "bg-slate-800 border border-slate-700 hover:scale-105"
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={
                    currentUser
                      ? "파티원들에게 전할 한마디를 적어보세요!"
                      : "메시지를 남기려면 먼저 입장해 주세요"
                  }
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setError("");
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-party-pink to-party-purple text-white text-xs font-bold rounded-xl shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>남기기</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
            </form>
          </div>

          {/* 방명록 카드 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {guestbook.map((gb) => (
              <div
                key={gb.id}
                className="bg-party-card border border-purple-500/20 rounded-2xl p-4 shadow-md flex items-start gap-3"
              >
                <div className="text-2xl p-2 bg-slate-900 rounded-xl border border-slate-800 flex-shrink-0">
                  {gb.sticker}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <strong className="text-xs text-white font-bold">{gb.fromUser}</strong>
                      <span className="text-[10px] text-slate-400 font-medium">({gb.fromRole})</span>
                    </div>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{gb.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {gb.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 특정 게스트 대상 메시지 모달 */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-party-card border border-purple-500/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <span>💌 {selectedGuest.nickname}님에게 응원 남기기</span>
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              스티커와 함께 따뜻한 네트워킹 메시지를 전해보세요!
            </p>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
              {STICKERS.map((stk) => (
                <button
                  key={stk}
                  type="button"
                  onClick={() => setSelectedSticker(stk)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition cursor-pointer ${
                    selectedSticker === stk
                      ? "bg-party-purple/40 border-2 border-party-pink scale-110 shadow-md shadow-purple-500/30"
                      : "bg-slate-800 border border-slate-700 hover:scale-105"
                  }`}
                >
                  {stk}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitMessage} className="space-y-3">
              <textarea
                rows={3}
                placeholder="예: 발표 내용 너무 잘 들었습니다! 파티 끝나고 커피챗 해요 ✨"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-purple-500/30 focus:border-party-pink rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                autoFocus
              />
              {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-party-pink to-party-purple text-white rounded-xl text-xs font-bold shadow-md shadow-pink-500/20 hover:opacity-90 cursor-pointer"
                >
                  전송하기 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
