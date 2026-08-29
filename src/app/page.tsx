"use client";

import React, { useState, useEffect } from "react";
import Header, { ActiveTab } from "@/components/Header";
import OnboardingModal from "@/components/OnboardingModal";
import QuestList from "@/components/QuestList";
import NetworkingWall from "@/components/NetworkingWall";
import Leaderboard from "@/components/Leaderboard";
import RewardStore from "@/components/RewardStore";
import QuestSuccessModal from "@/components/QuestSuccessModal";
import { UserProfile, PartyInfo, Quest, GuestbookEntry, RewardItem } from "@/types/party";
import { PRESET_QUESTS } from "@/data/presetQuests";
import { MOCK_GUESTS, INITIAL_GUESTBOOK } from "@/data/mockGuests";
import { MOCK_REWARDS } from "@/data/mockRewards";
import { triggerConfetti } from "@/utils/confetti";
import { Flame, ArrowRight } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("quests");
  const [quests, setQuests] = useState<Quest[]>(PRESET_QUESTS);
  const [guests, setGuests] = useState<UserProfile[]>(MOCK_GUESTS);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
  const [completedQuestModalData, setCompletedQuestModalData] = useState<Quest | null>(null);
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

        // 게스트 목록에 내 프로필 추가/동기화
        setGuests((prev) => {
          const filtered = prev.filter((g) => g.id !== parsedUser.id);
          return [parsedUser, ...filtered];
        });

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
    setGuests((prev) => [newUser, ...prev.filter((g) => g.id !== newUser.id)]);
    setIsOnboardingOpen(false);
    triggerConfetti();
  };

  // 퀘스트 완료 처리 + Confetti 폭죽 + 성공 모달
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

    // 포인트 계산 및 유저 상태 업데이트
    let newPoints = targetQuest.points;
    if (user) {
      newPoints = user.points + targetQuest.points;
      const updatedUser: UserProfile = {
        ...user,
        points: newPoints,
        completedQuestIds: [...user.completedQuestIds, questId],
      };
      setUser(updatedUser);
      setGuests((prev) =>
        prev.map((g) => (g.id === updatedUser.id ? updatedUser : g))
      );
      localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));
    }

    // 폭죽 효과 및 모달 오픈
    triggerConfetti();
    setCompletedQuestModalData(targetQuest);
  };

  // 방명록 작성 처리 및 Q4 퀘스트 자동 완료 연동
  const handleAddGuestbookEntry = (entry: Omit<GuestbookEntry, "id" | "createdAt">) => {
    const newGb: GuestbookEntry = {
      ...entry,
      id: "gb_" + Date.now(),
      createdAt: "방금 전",
    };
    setGuestbook((prev) => [newGb, ...prev]);
    triggerConfetti();

    // Q4 미션 자동 완료 연동
    const q4 = quests.find((q) => q.id === "quest_4");
    if (q4 && !q4.completed) {
      handleCompleteQuest("quest_4", `"${entry.message}" 남김 (${entry.sticker})`);
    }
  };

  // 리워드 교환 핸들러 (포인트 차감 및 수량 감소)
  const handleRedeemReward = (reward: RewardItem) => {
    if (!user || user.points < reward.pointsRequired) return;

    const updatedUser: UserProfile = {
      ...user,
      points: user.points - reward.pointsRequired,
    };
    setUser(updatedUser);
    setGuests((prev) =>
      prev.map((g) => (g.id === updatedUser.id ? updatedUser : g))
    );
    localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));

    setRewards((prev) =>
      prev.map((r) =>
        r.id === reward.id
          ? { ...r, availableCount: Math.max(0, r.availableCount - 1) }
          : r
      )
    );
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
          <NetworkingWall
            currentUser={user}
            guests={guests}
            guestbook={guestbook}
            onAddGuestbookEntry={handleAddGuestbookEntry}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === "leaderboard" && (
          <Leaderboard
            currentUser={user}
            guests={guests}
          />
        )}

        {activeTab === "rewards" && (
          <RewardStore
            currentUser={user}
            rewards={rewards}
            onRedeemReward={handleRedeemReward}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
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

      {/* 퀘스트 완료 축하 모달 */}
      <QuestSuccessModal
        quest={completedQuestModalData}
        currentPoints={user?.points || 0}
        onClose={() => setCompletedQuestModalData(null)}
        onGoToRewards={() => setActiveTab("rewards")}
      />
    </main>
  );
}
