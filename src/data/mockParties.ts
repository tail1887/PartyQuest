import { PartyRoom } from "@/types/party";
import { PRESET_QUESTS } from "./presetQuests";
import { MOCK_GUESTS, INITIAL_GUESTBOOK } from "./mockGuests";
import { INITIAL_PHOTO_FEED } from "./mockPhotoFeed";

const BASE_URL = typeof window !== "undefined" ? window.location.origin : "https://partyquest-app.vercel.app";

export const INITIAL_PARTIES: PartyRoom[] = [
  {
    id: "pq_io_2026",
    name: "2026 I/O Extended: Hack the Beat Party",
    theme: "AI, Music & Tech Gathering 🌴",
    location: "Google Hackathon Main Hall (강남 파이낸스 타워 15F)",
    announcement: "📢 환영합니다! 파티 퀘스트를 완수하고 스낵바 음료권과 럭키드로우 티켓을 획득하세요!",
    hostName: "Google Hackathon Team",
    bannerImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("https://partyquest-app.vercel.app/?partyId=pq_io_2026")}`,
    createdAt: "2026.08.29",
    activeGuestsCount: 42,
    quests: PRESET_QUESTS,
    guests: MOCK_GUESTS,
    guestbook: INITIAL_GUESTBOOK,
    photoFeed: INITIAL_PHOTO_FEED,
  },
  {
    id: "pq_founders_night",
    name: "AI & Web3 Founders Night 🍸",
    theme: "스타트업 창업가 & VC VIP 네트워킹 🥂",
    location: "테헤란로 루프탑  lounge (삼성역 3번 출구)",
    announcement: "📢 투자 유치 및 공동 창업 파트너를 찾는 창업가분들의 피칭 & 바베큐 파티입니다!",
    hostName: "Antigravity Ventures",
    bannerImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("https://partyquest-app.vercel.app/?partyId=pq_founders_night")}`,
    createdAt: "2026.08.30",
    activeGuestsCount: 28,
    quests: [
      {
        id: "fq_1",
        title: "VC / 투자자 파티원과 명함/SNS 교환하기 🤝",
        description: "현장에서 1분 엘리베이터 피칭 후 인스타그램/링크드인 연락처를 교환해 보세요!",
        points: 120,
        category: "아이스브레이킹",
        type: "input",
        inputPlaceholder: "예: Antigravity 파트너님과 명함 교환 완료!",
        completed: false,
      },
      {
        id: "fq_2",
        title: "루프탑 바베큐 파티 인증 셀카 📸",
        description: "야경 배경 루프탑에서 칵테일 잔 들고 찍은 파티 인증샷을 올려주세요!",
        points: 100,
        category: "스낵바",
        type: "photo",
        completed: false,
      },
    ],
    guests: MOCK_GUESTS.slice(0, 3),
    guestbook: [
      {
        id: "gb_f1",
        fromUser: "현우_PM",
        fromRole: "👔 기획/PM",
        message: "오늘 AI 에이전트 서비스 피칭 예정입니다! 창업가분들 대환영 🔥",
        sticker: "🚀",
        createdAt: "10분 전",
        tag: "CHEER",
      },
    ],
    photoFeed: [],
  },
  {
    id: "pq_design_club",
    name: "글로벌 디자이너 & DJ 네온 파티 🎉",
    theme: "UX 디자이너 & 사운드 프로듀서 밤샘 네트워킹 🎧",
    location: "홍대 비주얼 아트 클럽 (Hongdae Vibe Studio)",
    announcement: "📢 미디어 아트, 3D UX 디자이너와 DJ들의 감성 폭발 네온 비트 파티!",
    hostName: "Studio Vibe FX",
    bannerImage: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent("https://partyquest-app.vercel.app/?partyId=pq_design_club")}`,
    createdAt: "2026.09.01",
    activeGuestsCount: 35,
    quests: [
      {
        id: "dq_1",
        title: "DJ 부스에 신청곡 & 댄스 인증샷 🎵",
        description: "좋아하는 비트 신청곡을 요청하고 DJ 부스 앞에서 신나게 즐기는 사진을 올려주세요!",
        points: 90,
        category: "미션",
        type: "photo",
        completed: false,
      },
    ],
    guests: MOCK_GUESTS.slice(1, 4),
    guestbook: [],
    photoFeed: [],
  },
];
