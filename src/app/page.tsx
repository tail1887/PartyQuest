"use client";

import React, { useState, useEffect } from "react";
import Header, { ActiveTab } from "@/components/Header";
import OnboardingModal from "@/components/OnboardingModal";
import QuestList from "@/components/QuestList";
import { UserProfile, PartyInfo, Quest } from "@/types/party";
import { PRESET_QUESTS } from "@/data/presetQuests";
import { Flame, ArrowRight } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("quests");
  const [quests, setQuests] = useState<Quest[]>(PRESET_QUESTS);
  const [partyInfo, setPartyInfo] = useState<PartyInfo>({
    name: "2026 I/O Extended: Hack the Beat Networking Party",
    theme: "AI, Music & Tech Gathering 🌴",
    location: "Google Hackathon Main Hall",
    announcement: "📢 환영합니다! 파티 퀘스트를 완수하고 스낵바 음료권과 럭키드로우 티켓을 획득하세요!",
    activeGuestsCount: 42,
  });

  // 로컬스토리지에서 기존 유저 및 퀘스트 상태 로드
  useEffect(() => {
    const savedUser = localStorage.getItem("partyquest_user");
    if (savedUser) {
      try {
        const parsedUser: UserProfile = JSON.parse(savedUser);
        setUser(parsedUser);

        // 유저 완료 퀘스트 동기화
        if (parsedUser.completedQuestIds && parsedUser.completedQuestIds.length > 0) {
          setQuests((prev) =>
            prev.map((q) => ({
              ...q,
              completed: parsedUser.completedQuestIds.includes(q.id),
            }))
          );
        }
      } catch (e) {
        setIsOnboardingOpen(true);
      }
    } else {
      setIsOnboardingOpen(true);
    }
  }, []);

  const handleOnboardingComplete = (newUser: UserProfile) => {
    setUser(newUser);
    setIsOnboardingOpen(false);
  };

  // 퀘스트 완료 임시 핸들러 (Task 4에서 포인트 및 Confetti 연동 강화)
  const handleCompleteQuest = (questId: string, answer?: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.completed) return;

    const updatedQuests = quests.map((q) =>
      q.id === questId
        ? {
            ...q,
            completed: true,
            completedAt: new Date().toISOString(),
            userAnswer: answer,
          }
        : q
    );
    setQuests(updatedQuests);

    // 유저 포인트 및 완료 ID 업데이트
    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        points: user.points + targetQuest.points,
        completedQuestIds: [...user.completedQuestIds, questId],
      };
      setUser(updatedUser);
      localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <main className="min-h-screen flex flex-col pb-20">
      {/* 헤더 & 네비게이션 */}
      <Header
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onEditProfile={() => setIsOnboardingOpen(true)}
        activeGuestsCount={partyInfo.activeGuestsCount}
      />

      {/* 메인 컨텐츠 영역 */}
      <div className="max-w-5xl w-full mx-auto px-4 py-6">
        {/* 파티 배너 & 공지 */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900/80 to-pink-900/60 border border-purple-500/30 p-6 sm:p-8 mb-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                <Flame className="w-3.5 h-3.5 text-party-pink animate-pulse" /> {partyInfo.theme}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {partyInfo.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                {partyInfo.announcement}
              </p>
            </div>

            {!user && (
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-party-pink to-party-purple text-white rounded-2xl text-xs font-bold shadow-lg shadow-pink-500/30 hover:opacity-90 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>3초 입장하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* 탭별 뷰 */}
        {activeTab === "quests" && (
          <QuestList
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            onNavigateSocial={() => setActiveTab("networking")}
          />
        )}

        {activeTab === "networking" && (
          <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              🤝 참가자 네트워킹 월
            </h3>
            <p className="text-xs text-slate-400">
              파티 참가자들의 프로필을 보고 응원 방명록을 남겨보세요! (Task 5 구현 예정)
            </p>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              🏆 실시간 포인트 랭킹
            </h3>
            <p className="text-xs text-slate-400">
              가장 적극적으로 파티를 즐긴 참가자 TOP 랭킹입니다! (Task 6 구현 예정)
            </p>
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              🎁 리워드 교환소
            </h3>
            <p className="text-xs text-slate-400">
              모은 포인트로 스낵바 음료권 및 럭키드로우 티켓을 교환하세요! (Task 6 구현 예정)
            </p>
          </div>
        )}

        {activeTab === "host" && (
          <div className="bg-party-card border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              ⚙️ 호스트 파티 관리자 모드
            </h3>
            <p className="text-xs text-slate-400">
              파티 정보와 퀘스트를 실시간으로 커스텀하세요! (Task 7 구현 예정)
            </p>
          </div>
        )}
      </div>

      {/* 온보딩 모달 */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onComplete={handleOnboardingComplete}
      />
    </main>
  );
}
