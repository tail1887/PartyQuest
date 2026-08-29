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
import LuckyRouletteModal from "@/components/LuckyRouletteModal";
import SponsorModal from "@/components/SponsorModal";
import CreateQuestModal from "@/components/CreateQuestModal";
import MyCouponWalletModal from "@/components/MyCouponWalletModal";
import CreatePartyModal from "@/components/CreatePartyModal";
import { UserProfile, PartyInfo, Quest, GuestbookEntry, RewardItem, QuestSubmission, PhotoFeedEntry, RedeemedCoupon, PartyRoom } from "@/types/party";
import { PRESET_QUESTS } from "@/data/presetQuests";
import { MOCK_GUESTS, INITIAL_GUESTBOOK } from "@/data/mockGuests";
import { MOCK_REWARDS } from "@/data/mockRewards";
import { INITIAL_PHOTO_FEED } from "@/data/mockPhotoFeed";
import { INITIAL_PARTIES } from "@/data/mockParties";
import { triggerConfetti } from "@/utils/confetti";
import { Flame, ArrowRight, Dices, Crown, PlusCircle, QrCode, Sparkles, MapPin, Users, Calendar, X, ExternalLink, Share2, Copy, Check, Ticket, PartyPopper } from "lucide-react";

export default function Home() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [isCreatePartyOpen, setIsCreatePartyOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("quests");

  // 이벤터스 스타일 멀티 파티 및 랜딩 상태 (무조건 디폴트는 랜딩 모드!)
  const [parties, setParties] = useState<PartyRoom[]>(INITIAL_PARTIES);
  const [currentParty, setCurrentParty] = useState<PartyRoom>(INITIAL_PARTIES[0]);
  const [isLandingMode, setIsLandingMode] = useState<boolean>(true);

  // 현장 파티 초대 QR코드 모달 팝업 상태
  const [partyQrModalData, setPartyQrModalData] = useState<PartyRoom | null>(null);

  // 실시간 퀘스트 / 게스트 / 방명록 / 사진피드 상태
  const [quests, setQuests] = useState<Quest[]>(INITIAL_PARTIES[0].quests);
  const [guests, setGuests] = useState<UserProfile[]>(INITIAL_PARTIES[0].guests);
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(INITIAL_PARTIES[0].guestbook);
  const [photoFeed, setPhotoFeed] = useState<PhotoFeedEntry[]>(INITIAL_PARTIES[0].photoFeed);
  const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
  const [completedQuestModalData, setCompletedQuestModalData] = useState<Quest | null>(null);

  // 룰렛 당첨 전용 QR 모달 상태
  const [rouletteWonCouponModal, setRouletteWonCouponModal] = useState<RedeemedCoupon | null>(null);

  // URL query (?partyId=...) 확인: 초대 링크 타셨을 때만 바로 파티룸 접속!
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const partyId = params.get("partyId");
      if (partyId) {
        const found = parties.find((p) => p.id === partyId);
        if (found) {
          handleSelectParty(found);
          setIsLandingMode(false);
        }
      }
    }
  }, []);

  // 로컬스토리지에서 유저 상태 로드
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

  // 탭 변경 시 'home' 탭 선택 처리
  const handleTabChange = (tab: ActiveTab) => {
    if (tab === "home") {
      setIsLandingMode(true);
      setActiveTab("quests");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setIsLandingMode(false);
      setActiveTab(tab);
    }
  };

  // 특정 파티룸으로 입장 처리
  const handleSelectParty = (party: PartyRoom) => {
    setCurrentParty(party);
    setQuests(party.quests);
    setGuests(party.guests);
    setGuestbook(party.guestbook);
    setPhotoFeed(party.photoFeed);
    setIsLandingMode(false);
    setActiveTab("quests");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 새 파티 생성 완료 처리
  const handlePartyCreated = (newParty: PartyRoom) => {
    setParties((prev) => [newParty, ...prev]);
    handleSelectParty(newParty);
  };

  const handleOnboardingComplete = (newUser: UserProfile) => {
    setUser(newUser);
    setGuests((prev) => [newUser, ...prev.filter((g) => g.id !== newUser.id)]);
    setIsOnboardingOpen(false);
    triggerConfetti();
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
      message: `🎯 [현상금 퀘스트 개설] ${bountyCost}P를 내걸고 "${newQuestData.title}" 퀘스트를 개설했습니다!`,
      sticker: "💰",
      tag: "QUEST_PROOF",
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

  // 사진 피드 이모지 스티커 반응
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
          newMyReactions = myReactions.filter((s) => s !== sticker);
          newCount = Math.max(0, (item.reactions[sticker] || 1) - 1);
        } else {
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
      tag: entry.tag || "CHEER",
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

  // 🎰 룰렛 당첨 처리
  const handleSpinSuccess = (rewardName: string, bonusPoints?: number) => {
    if (!user) return;
    const cost = 50;
    let addedPoints = (bonusPoints || 0) - cost;

    let newCoupons = [...(user.myCoupons || [])];
    let createdCoupon: RedeemedCoupon | null = null;

    let couponIcon = "🎁";
    let couponCode = "PQ-ROULETTE-" + Math.floor(1000 + Math.random() * 9000);

    if (rewardName.includes("음료")) couponIcon = "🍹";
    else if (rewardName.includes("경품")) couponIcon = "🎟️";
    else if (rewardName.includes("스낵")) couponIcon = "🍕";
    else if (rewardName.includes("후광")) couponIcon = "👑";

    if (!bonusPoints) {
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

    handleAddGuestbookEntry({
      fromUser: user.nickname,
      fromRole: user.role,
      message: `🎰 룰렛을 돌려 [${rewardName}]에 당첨되었습니다!`,
      sticker: "🎲",
      tag: "QUEST_PROOF",
    });

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
      tag: "CHEER",
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
      {/* 헤더 & 네비게이션 */}
      <Header
        user={user}
        activeTab={isLandingMode ? "home" : activeTab}
        setActiveTab={handleTabChange}
        onEditProfile={() => setIsOnboardingOpen(true)}
        onOpenWallet={() => setIsWalletOpen(true)}
        onGoToPartyList={() => setIsLandingMode(true)}
        onOpenPartyQr={() => setPartyQrModalData(currentParty)}
        currentPartyName={isLandingMode ? "파티 개설 & 탐색 서비스 홈" : currentParty.name}
        activeGuestsCount={currentParty.activeGuestsCount}
      />

      <div className="max-w-5xl w-full mx-auto px-4 py-6">
        {/* ======================================================== */}
        {/* 1. 이벤터스/Luma 스타일 파티 목록 랜딩 뷰 (디폴트 메인 진입점!) */}
        {/* ======================================================== */}
        {isLandingMode ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 이벤터스 스타일 개설 히어로 배너 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/80 via-slate-900/90 to-pink-900/80 border border-purple-500/40 p-8 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" /> EVENTUS & LUMA STYLE PLATFORM
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  파티를 개최하고, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-party-pink via-purple-300 to-party-cyan">
                    QR초대로 참가자를 모으세요!
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
                  누구나 1초 만에 나만의 파티퀘스트 개설 가능! 현장 스캔 초대 QR코드 발급부터 퀘스트 게이미피케이션, 소셜 피드까지 올인원으로 관리하세요.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsCreatePartyOpen(true)}
                    className="px-6 py-3.5 bg-gradient-to-r from-party-pink to-party-purple hover:opacity-90 active:scale-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-pink-500/30 flex items-center gap-2 cursor-pointer transition"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>🎉 나만의 파티 개최하기 (QR코드 자동 생성)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 현재 열린 파티 탐색 리스트 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-party-pink animate-pulse" /> 현재 진행 중인 열린 파티 목록
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    참가하고 싶은 파티를 선택하거나 현장 QR코드를 스캔하여 전용 퀘스트 룸에 입장하세요!
                  </p>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full border border-purple-500/30">
                  {parties.length}개 파티 오픈 중
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {parties.map((party) => (
                  <div
                    key={party.id}
                    className="bg-party-card border border-purple-500/30 hover:border-purple-500/70 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition group"
                  >
                    <div>
                      {/* 배너 이미지 */}
                      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                        <img
                          src={party.bannerImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"}
                          alt={party.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                          {party.theme}
                        </span>
                      </div>

                      {/* 정보 본문 */}
                      <div className="p-5 space-y-3">
                        <h4 className="text-base font-bold text-white leading-snug group-hover:text-party-pink transition">
                          {party.name}
                        </h4>

                        <div className="space-y-1.5 text-xs text-slate-300">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-party-cyan flex-shrink-0" />
                            <span className="truncate">{party.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                            <span>호스트: <strong>{party.hostName}</strong> ({party.activeGuestsCount}명 서버 접속)</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 line-clamp-2">
                          "{party.announcement}"
                        </p>
                      </div>
                    </div>

                    {/* 카드 하단 액션 버튼 */}
                    <div className="p-4 pt-0 flex gap-2">
                      <button
                        onClick={() => setPartyQrModalData(party)}
                        className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="현장 초청 QR코드 열기"
                      >
                        <QrCode className="w-4 h-4 text-amber-400" />
                        <span className="hidden sm:inline">QR코드</span>
                      </button>

                      <button
                        onClick={() => handleSelectParty(party)}
                        className="flex-1 py-2.5 px-4 bg-gradient-to-r from-party-pink to-party-purple text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-500/20 hover:opacity-90 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>파티룸 입장하기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. 파티룸 게임 뷰 (Current Active Party Game Room) */
          /* ======================================================== */
          <div>
            {/* 파티 메인 헤더 배너 */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-900/60 via-slate-900/80 to-pink-900/60 border border-purple-500/30 p-6 sm:p-8 mb-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      <Flame className="w-3.5 h-3.5 text-party-pink animate-pulse" /> {currentParty.theme}
                    </span>
                    <button
                      onClick={() => setIsLandingMode(true)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer"
                    >
                      ← 파티 목록 홈으로 나가기
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {currentParty.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                    {currentParty.announcement}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setPartyQrModalData(currentParty)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-amber-300 rounded-2xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>📱 초대 QR</span>
                  </button>

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
                partyInfo={{
                  name: currentParty.name,
                  theme: currentParty.theme,
                  location: currentParty.location,
                  announcement: currentParty.announcement,
                  activeGuestsCount: currentParty.activeGuestsCount,
                }}
                onUpdatePartyInfo={(info) => {
                  setCurrentParty((prev) => ({ ...prev, ...info }));
                }}
                quests={quests}
                onAddQuest={handleAddQuest}
                onDeleteQuest={handleDeleteQuest}
                guestCount={guests.length}
              />
            )}
          </div>
        )}
      </div>

      {/* 현장 파티 초청 전용 QR코드 모달 */}
      {partyQrModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150">
          <div className="relative w-full max-w-sm bg-party-card border border-purple-500/50 rounded-3xl p-6 shadow-2xl text-center text-slate-100">
            <button
              onClick={() => setPartyQrModalData(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40 mb-2">
              파티 현장 스캔 전용 QR코드
            </span>

            <h4 className="text-lg font-bold text-white mb-1">
              {partyQrModalData.name}
            </h4>
            <p className="text-xs text-slate-300 mb-5">
              스마트폰 카메라로 QR을 스캔하거나 링크를 공유해 입장하세요!
            </p>

            <div className="bg-white text-slate-950 rounded-2xl p-5 mb-4 shadow-xl max-w-xs mx-auto">
              <img
                src={partyQrModalData.qrUrl}
                alt="파티 입장 QR"
                className="w-48 h-48 mx-auto rounded-xl border border-slate-200 shadow-md"
              />
              <p className="text-[10px] text-slate-500 mt-3 font-mono">
                호스트: {partyQrModalData.hostName}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const origin = typeof window !== "undefined" ? window.location.origin : "https://partyquest-app.vercel.app";
                  const shareUrl = `${origin}/?partyId=${partyQrModalData.id}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert("파티 초청 링크가 복사되었습니다!");
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-party-pink to-party-purple text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
              >
                초청 링크 복사하기 🔗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 나만의 파티 개최 모달 */}
      <CreatePartyModal
        isOpen={isCreatePartyOpen}
        onClose={() => setIsCreatePartyOpen(false)}
        onPartyCreated={handlePartyCreated}
      />

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

      {/* 글로벌 마이월렛 쿠폰 보관함 모달 */}
      <MyCouponWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        coupons={user?.myCoupons || []}
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
