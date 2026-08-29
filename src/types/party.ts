export type Role = "💻 개발자" | "🎨 디자이너" | "👔 기획/PM" | "🎵 DJ/음악" | "🚀 창업가" | "🎉 파티러버";
export type UserRole = Role;

export interface UserProfile {
  id: string;
  nickname: string;
  role: Role;
  bio: string;
  instagram?: string;
  linkedin?: string;
  points: number;
  completedQuestIds: string[];
  joinedAt: string;
  avatarColor: string;
}

export type QuestType = "click" | "input" | "check" | "photo" | "social";

export interface QuestSubmission {
  id: string;
  userId: string;
  userName: string;
  photoUrl?: string;
  answerText?: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "아이스브레이킹" | "스낵바" | "미션" | "소셜" | "유저현상금";
  type: QuestType;
  inputPlaceholder?: string;
  completed: boolean;
  completedAt?: string;
  userAnswer?: string;
  creatorId?: string;
  creatorName?: string;
  requiresApproval?: boolean;
  photoUrl?: string;
  pendingSubmissions?: QuestSubmission[];
}

export interface GuestbookEntry {
  id: string;
  fromUser: string;
  fromRole: string;
  toUserId?: string;
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
  couponCode: string;
}

export interface PartyInfo {
  name: string;
  theme: string;
  location: string;
  announcement: string;
  activeGuestsCount: number;
}
