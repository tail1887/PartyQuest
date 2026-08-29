"use client";

import React, { useState, useEffect } from "react";
import Header, { ActiveTab } from "@/components/Header";
import OnboardingModal from "@/components/OnboardingModal";
import QuestList from "@/components/QuestList";
import NetworkingWall from "@/components/NetworkingWall";
import Leaderboard from "@/components/Leaderboard";
import RewardStore from "@/components/RewardStore";
import HostDashboard from "@/components/HostDashboard";
import QuestSuccessModal from "@/components/QuestSuccessModal";
import JudgeQuickBanner from "@/components/JudgeQuickBanner";
import LuckyRouletteModal from "@/components/LuckyRouletteModal";
import SponsorModal from "@/components/SponsorModal";
import CreateQuestModal from "@/components/CreateQuestModal";
import MyCouponWalletModal from "@/components/MyCouponWalletModal";
import { UserProfile, PartyInfo, Quest, GuestbookEntry, RewardItem, QuestSubmission, PhotoFeedEntry, RedeemedCoupon } from "@/types/party";
import { PRESET_QUESTS } from "@/data/presetQuests";
import { MOCK_GUESTS, INITIAL_GUESTBOOK } from "@/data/mockGuests";
import { MOCK_REWARDS } from "@/data/mockRewards";
import { INITIAL_PHOTO_FEED } from "@/data/mockPhotoFeed";
import { triggerConfetti } from "@/utils/confetti";
import { Flame, ArrowRight, Dices, Crown, PlusCircle } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("quests");
  const [quests, setQuests] = useState<Quest[]>(PRESET_QUESTS);
  const [guests, setGuests] = useState<UserProfile[]>(MOCK_GUESTS);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK);
  const [photoFeed, setPhotoFeed] = useState<PhotoFeedEntry[]>(INITIAL_PHOTO_FEED);
  const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
  const [completedQuestModalData, setCompletedQuestModalData] = useState<Quest | null>(null);

  // 룰렛 당첨 전용 QR 모달 상태
  const [rouletteWonCouponModal, setRouletteWonCouponModal] = useState<RedeemedCoupon | null>(null);

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

        setGuests((prev) => {
          const filtered = prev.filter((g) => g.id !== parsedUser.id);
          return [parsedUser, ...filtered];
        });

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

  const handleQuickSetup = (judgeUser: UserProfile) => {
    setUser(judgeUser);
    setGuests((prev) => [judgeUser, ...prev.filter((g) => g.id !== judgeUser.id)]);
    setIsOnboardingOpen(false);

    setQuests((prev) =>
      prev.map((q) =>
        q.id === "quest_1" || q.id === "quest_2"
          ? { ...q, completed: true, completedAt: new Date().toISOString() }
          : q
      )
    );
  };

  // 퀘스트 완료 처리
  const handleCompleteQuest = (questId: string, answer?: string, photoUrl?: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest || targetQuest.completed) return;

    const updatedQuests = quests.map((q) =>
      q.id === questId
        ? {
            ...q,
            completed: true,
            completedAt: new Date().toISOString(),
            userAnswer: answer,
            photoUrl: photoUrl,
          }
        : q
    );
    setQuests(updatedQuests);

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

      if (photoUrl) {
        const newFeedEntry: PhotoFeedEntry = {
          id: "pf_" + Date.now(),
          userName: user.nickname,
          userRole: user.role,
          questTitle: targetQuest.title,
          photoUrl: photoUrl,
          caption: answer || "파티 퀘스트 인증 완수!",
          createdAt: "방금 전",
          reactions: { "🔥": 1, "🎉": 1 },
        };
        setPhotoFeed((prev) => [newFeedEntry, ...prev]);
      }
    }

    triggerConfetti();
    setCompletedQuestModalData(targetQuest);
  };

  // 생성자 승인 제출
  const handleSubmitForApproval = (questId: string, photoUrl?: string, answerText?: string) => {
    if (!user) return;

    const newSubmission: QuestSubmission = {
      id: "sub_" + Date.now(),
      userId: user.id,
      userName: user.nickname,
      photoUrl,
      answerText,
      submittedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "pending",
    };

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              pendingSubmissions: [...(q.pendingSubmissions || []), newSubmission],
            }
          : q
      )
    );
    triggerConfetti();
  };

  // 생성자: 승인 처리
  const handleApproveSubmission = (questId: string, submissionId: string) => {
    const targetQuest = quests.find((q) => q.id === questId);
    if (!targetQuest) return;

    const submission = targetQuest.pendingSubmissions?.find((s) => s.id === submissionId);
    if (!submission) return;

    setGuests((prev) =>
      prev.map((g) =>
        g.id === submission.userId
          ? {
              ...g,
              points: g.points + targetQuest.points,
              completedQuestIds: [...g.completedQuestIds, questId],
            }
          : g
      )
    );

    if (user && user.id === submission.userId) {
      const updatedUser: UserProfile = {
        ...user,
        points: user.points + targetQuest.points,
        completedQuestIds: [...user.completedQuestIds, questId],
      };
      setUser(updatedUser);
      localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));
    }

    if (submission.photoUrl) {
      const newFeedEntry: PhotoFeedEntry = {
        id: "pf_" + Date.now(),
        userName: submission.userName,
        userRole: "🎉 파티러버",
        questTitle: targetQuest.title,
        photoUrl: submission.photoUrl,
        caption: submission.answerText || "생성자 승인 완료 퀘스트 인증샷!",
        createdAt: "방금 전",
        reactions: { "🔥": 2, "👏": 1 },
      };
      setPhotoFeed((prev) => [newFeedEntry, ...prev]);
    }

    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              pendingSubmissions: q.pendingSubmissions?.filter((s) => s.id !== submissionId),
            }
          : q
      )
    );
    triggerConfetti();
  };

  // 생성자: 거절 처리
  const handleRejectSubmission = (questId: string, submissionId: string) => {
    setQuests((prev) =>
      prev.map((q) =>
        q.id === questId
          ? {
              ...q,
              pendingSubmissions: q.pendingSubmissions?.filter((s) => s.id !== submissionId),
            }
          : q
      )
    );
  };

  // 현상금 퀘스트 생성
  const handleAddUserQuest = (newQuestData: Omit<Quest, "id" | "completed">, bountyCost: number) => {
    if (!user || user.points < bountyCost) return;

    const updatedUser: UserProfile = {
      ...user,
      points: user.points - bountyCost,
    };
    setUser(updatedUser);
    setGuests((prev) => prev.map((g) => (g.id === updatedUser.id ? updatedUser : g)));
    localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));

    const newQuest: Quest = {
      ...newQuestData,
      id: "quest_bounty_" + Date.now(),
      completed: false,
    };
    setQuests((prev) => [newQuest, ...prev]);

    handleAddGuestbookEntry({
      fromUser: user.nickname,
      fromRole: user.role,
      message: `🎯 [현상금 퀘스트 생성] ${bountyCost}P를 내걸고 나만의 퀘스트 "${newQuestData.title}"를 개설했습니다!`,
      sticker: "💰",
    });
  };

  // 리워드 교환 핸들러
  const handleRedeemReward = (reward: RewardItem) => {
    if (!user || user.points < reward.pointsRequired) return;

    const newCoupon: RedeemedCoupon = {
      id: "cp_" + Date.now(),
      rewardId: reward.id,
      rewardTitle: reward.title,
      icon: reward.icon,
      couponCode: reward.couponCode,
      redeemedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isUsed: false,
    };

    const updatedUser: UserProfile = {
      ...user,
      points: user.points - reward.pointsRequired,
      myCoupons: [...(user.myCoupons || []), newCoupon],
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

  // 내 쿠폰 사용 완료 토글
  const handleToggleUseCoupon = (couponId: string) => {
    if (!user || !user.myCoupons) return;

    const updatedCoupons = user.myCoupons.map((c) =>
      c.id === couponId ? { ...c, isUsed: !c.isUsed } : c
    );

    const updatedUser: UserProfile = {
      ...user,
      myCoupons: updatedCoupons,
    };
    setUser(updatedUser);
    setGuests((prev) => prev.map((g) => (g.id === updatedUser.id ? updatedUser : g)));
    localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));
  };

  // 사진 피드 이모지 스티커 반응 (토글 +1 / -1)
  const handleReactPhotoFeed = (feedId: string, sticker: string) => {
    if (!user) return;

    setPhotoFeed((prev) =>
      prev.map((item) => {
        if (item.id !== feedId) return item;

        const myReactions = item.myReactions || [];
        const isReacted = myReactions.includes(sticker);

        let newMyReactions: string[];
        let newCount: number;

        if (isReacted) {
          // 취소 (-1)
          newMyReactions = myReactions.filter((s) => s !== sticker);
          newCount = Math.max(0, (item.reactions[sticker] || 1) - 1);
        } else {
          // 등록 (+1)
          newMyReactions = [...myReactions, sticker];
          newCount = (item.reactions[sticker] || 0) + 1;
        }

        return {
          ...item,
          myReactions: newMyReactions,
          reactions: {
            ...item.reactions,
            [sticker]: newCount,
          },
        };
      })
    );
  };

  // 방명록 작성 처리
  const handleAddGuestbookEntry = (entry: Omit<GuestbookEntry, "id" | "createdAt">) => {
    const newGb: GuestbookEntry = {
      ...entry,
      id: "gb_" + Date.now(),
      createdAt: "방금 전",
    };
    setGuestbook((prev) => [newGb, ...prev]);
    triggerConfetti();

    const q4 = quests.find((q) => q.id === "quest_4");
    if (q4 && !q4.completed) {
      handleCompleteQuest("quest_4", `"${entry.message}" 남김 (${entry.sticker})`);
    }
  };

  // 🎰 룰렛 당첨 처리 (쿠폰 당첨 시 내 보관함 저장 및 QR 팝업 자동 연동!)
  const handleSpinSuccess = (rewardName: string, bonusPoints?: number) => {
    if (!user) return;
    const cost = 50;
    let addedPoints = (bonusPoints || 0) - cost;

    let newCoupons = [...(user.myCoupons || [])];
    let createdCoupon: RedeemedCoupon | null = null;

    // 쿠폰류 당첨 판별 (음료/경품/스낵/후광)
    let couponIcon = "🎁";
    let couponCode = "PQ-ROULETTE-" + Math.floor(1000 + Math.random() * 9000);

    if (rewardName.includes("음료")) couponIcon = "🍹";
    else if (rewardName.includes("경품")) couponIcon = "🎟️";
    else if (rewardName.includes("스낵")) couponIcon = "🍕";
    else if (rewardName.includes("후광")) couponIcon = "👑";

    if (!bonusPoints) {
      // 쿠폰 상품 당첨!
      createdCoupon = {
        id: "cp_roulette_" + Date.now(),
        rewardId: "rw_roulette_" + Date.now(),
        rewardTitle: rewardName,
        icon: couponIcon,
        couponCode: couponCode,
        redeemedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isUsed: false,
      };
      newCoupons.push(createdCoupon);
    }

    const updatedUser: UserProfile = {
      ...user,
      points: Math.max(0, user.points + addedPoints),
      myCoupons: newCoupons,
    };

    setUser(updatedUser);
    setGuests((prev) => prev.map((g) => (g.id === updatedUser.id ? updatedUser : g)));
    localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));

    // 방명록에 당첨 등재
    handleAddGuestbookEntry({
      fromUser: user.nickname,
      fromRole: user.role,
      message: `🎰 룰렛을 돌려 [${rewardName}]에 당첨되었습니다!`,
      sticker: "🎲",
    });

    // 쿠폰 당첨인 경우 즉시 QR코드 모달 팝업 출동!
    if (createdCoupon) {
      setRouletteWonCouponModal(createdCoupon);
    }
  };

  // 파티 후원 처리
  const handleSponsorSuccess = (amount: number, message: string) => {
    if (!user) return;

    const updatedUser: UserProfile = {
      ...user,
      nickname: `👑 ${user.nickname.replace(/^👑\s*/, "")}`,
      points: user.points + 150,
      avatarColor: "from-amber-400 via-orange-500 to-pink-500",
    };
    setUser(updatedUser);
    setGuests((prev) => prev.map((g) => (g.id === updatedUser.id ? updatedUser : g)));
    localStorage.setItem("partyquest_user", JSON.stringify(updatedUser));

    handleAddGuestbookEntry({
      fromUser: updatedUser.nickname,
      fromRole: `${updatedUser.role} (👑 SPONSOR)`,
      message: `💖 파티를 위해 ${amount.toLocaleString()}원을 후원했습니다: "${message}"`,
      sticker: "👑",
    });
  };

  // 호스트 기능: 새 퀘스트 추가
  const handleAddQuest = (newQuestData: Omit<Quest, "id" | "completed">) => {
    const newQuest: Quest = {
      ...newQuestData,
      id: "quest_custom_" + Date.now(),
      completed: false,
    };
    setQuests((prev) => [newQuest, ...prev]);
  };

  // 호스트 기능: 퀘스트 삭제
  const handleDeleteQuest = (questId: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  return (
    <main className="min-h-screen flex flex-col pb-20">
      {/* 심사관 원클릭 퀵 데모 배너 */}
      <JudgeQuickBanner onQuickSetup={handleQuickSetup} />

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
        {/* 파티 배너 & 공지 & 룰렛/후원/나만의 퀘스트 퀵 버튼 */}
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCreateQuestOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 active:scale-95 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-slate-950" />
                <span>+ 퀘스트 만들기</span>
              </button>

              <button
                onClick={() => setIsRouletteOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-party-pink to-purple-600 hover:opacity-90 active:scale-95 text-white rounded-2xl text-xs font-bold shadow-lg shadow-pink-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Dices className="w-4 h-4 text-amber-300" />
                <span>🎰 룰렛</span>
              </button>

              <button
                onClick={() => setIsSponsorOpen(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-300 to-pink-500 hover:opacity-90 active:scale-95 text-slate-950 rounded-2xl text-xs font-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>👑 후원</span>
              </button>
            </div>
          </div>
        </div>

        {/* 탭별 뷰 */}
        {activeTab === "quests" && (
          <QuestList
            quests={quests}
            onCompleteQuest={handleCompleteQuest}
            onSubmitForApproval={handleSubmitForApproval}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onNavigateSocial={() => setActiveTab("networking")}
            onOpenCreateQuestModal={() => setIsCreateQuestOpen(true)}
          />
        )}

        {activeTab === "networking" && (
          <NetworkingWall
            currentUser={user}
            guests={guests}
            guestbook={guestbook}
            photoFeed={photoFeed}
            onAddGuestbookEntry={handleAddGuestbookEntry}
            onReactPhotoFeed={handleReactPhotoFeed}
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
            myCoupons={user?.myCoupons || []}
            onRedeemReward={handleRedeemReward}
            onToggleUseCoupon={handleToggleUseCoupon}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {activeTab === "host" && (
          <HostDashboard
            partyInfo={partyInfo}
            onUpdatePartyInfo={setPartyInfo}
            quests={quests}
            onAddQuest={handleAddQuest}
            onDeleteQuest={handleDeleteQuest}
            guestCount={guests.length}
          />
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

      {/* 행운의 파티 룰렛 모달 */}
      <LuckyRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        currentUser={user}
        onSpinSuccess={handleSpinSuccess}
      />

      {/* 🎰 룰렛 당첨 쿠폰 전용 QR 모달 */}
      <MyCouponWalletModal
        isOpen={!!rouletteWonCouponModal}
        onClose={() => setRouletteWonCouponModal(null)}
        coupons={rouletteWonCouponModal ? [rouletteWonCouponModal] : []}
        onToggleUseCoupon={handleToggleUseCoupon}
      />

      {/* 파티 후원 스폰서십 모달 */}
      <SponsorModal
        isOpen={isSponsorOpen}
        onClose={() => setIsSponsorOpen(false)}
        currentUser={user}
        onSponsorSuccess={handleSponsorSuccess}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />

      {/* 나만의 현상금 퀘스트 생성 모달 */}
      <CreateQuestModal
        isOpen={isCreateQuestOpen}
        onClose={() => setIsCreateQuestOpen(false)}
        currentUser={user}
        onAddUserQuest={handleAddUserQuest}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
      />
    </main>
  );
}
