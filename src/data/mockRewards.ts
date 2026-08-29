import { RewardItem } from "@/types/party";

export const MOCK_REWARDS: RewardItem[] = [
  {
    id: "reward_1",
    title: "스낵바 프리미엄 음료 1잔 교환권 🍹",
    description: "바텐더/스태프에게 바코드를 제시하고 칵테일, 논알콜 에이드 또는 수제 맥주 1잔을 받으세요!",
    pointsRequired: 100,
    icon: "🍹",
    availableCount: 30,
    couponCode: "PQ-DRINK-2026",
  },
  {
    id: "reward_2",
    title: "파티 스페셜 핑거푸드 세트 🍕",
    description: "피자, 나초, 미니 타코 등 따끈따끈한 파티 스낵 플레이트를 교환할 수 있습니다.",
    pointsRequired: 150,
    icon: "🍕",
    availableCount: 20,
    couponCode: "PQ-SNACK-7788",
  },
  {
    id: "reward_3",
    title: "파티 럭키드로우 경품 응모권 🎟️",
    description: "파티 피날레에 진행되는 Google 굿즈 & 테크 기기 추첨에 자동으로 응모됩니다!",
    pointsRequired: 200,
    icon: "🎟️",
    availableCount: 50,
    couponCode: "PQ-LUCKY-9999",
  },
  {
    id: "reward_4",
    title: "VIP 네트워킹 뱃지 & 호스트 기프트 👑",
    description: "가장 열정적으로 파티를 즐긴 참가자에게 수여하는 한정판 골드 뱃지와 특별 선물 패키지입니다.",
    pointsRequired: 300,
    icon: "👑",
    availableCount: 5,
    couponCode: "PQ-VIP-GOLD-01",
  },
];
