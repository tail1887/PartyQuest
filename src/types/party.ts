export type UserRole = "💻 개발자" | "🎨 디자이너" | "🎉 파티러버" | "👔 기획/PM" | "🚀 창업가" | "🎵 DJ/음악";

export interface UserProfile {
  id: string;
  nickname: string;
  role: UserRole;
  bio: string;
  instagram?: string;
  linkedin?: string;
  points: number;
  completedQuestIds: string[];
  joinedAt: string;
  avatarColor: string;
}

export type QuestType = "input" | "click" | "check" | "social";

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "아이스브레이킹" | "미션" | "스낵바" | "소셜";
  type: QuestType;
  inputPlaceholder?: string;
  targetCount?: number;
  completed: boolean;
  completedAt?: string;
  userAnswer?: string;
}

export interface GuestbookEntry {
  id: string;
  fromUser: string;
  fromRole: string;
  toUserId?: string; // 특정 유저 또는 전체 방명록
  message: string;
  sticker: string;
  createdAt: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  availableCount: number;
  couponCode?: string;
}

export interface PartyInfo {
  name: string;
  theme: string;
  location: string;
  announcement: string;
  activeGuestsCount: number;
}
