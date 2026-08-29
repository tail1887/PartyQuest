import { PhotoFeedEntry } from "@/types/party";

export const INITIAL_PHOTO_FEED: PhotoFeedEntry[] = [
  {
    id: "pf_1",
    userName: "민지_Dev",
    userRole: "💻 개발자",
    questTitle: "호스트와 셀카 찍고 인스타 인증 📸",
    photoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
    caption: "오늘 파티 분위기 미쳤습니다! 호스트님이랑 퀘스트 셀카 완료 🔥",
    createdAt: "5분 전",
    reactions: { "🔥": 8, "🎉": 12, "💖": 5 },
  },
  {
    id: "pf_2",
    userName: "준호_DJ",
    userRole: "🎵 DJ/음악",
    questTitle: "스낵바에서 음료 받고 하이파이브! 🍹",
    photoUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    caption: "스낵바 칵테일 교환 성공 🍹 다들 DJ 부스로 놀러오세요!",
    createdAt: "12분 전",
    reactions: { "🍹": 15, "🔥": 10, "👏": 7 },
  },
  {
    id: "pf_3",
    userName: "서연_UX",
    userRole: "🎨 디자이너",
    questTitle: "다른 참가자 프로필 월에 응원 남기기 💌",
    photoUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
    caption: "네트워킹 월에 스티커 듬뿍 남기고 갑니다 ✨ 파티퀘스트 최고!",
    createdAt: "20분 전",
    reactions: { "💖": 9, "✨": 14, "🎉": 6 },
  },
];
