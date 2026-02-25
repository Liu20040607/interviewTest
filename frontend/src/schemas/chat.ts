export type MessageRole = "user" | "assistant";

export type Rating = 1 | 2 | 3 | 4 | 5 | null;

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string; // ISO 8601
  rating: Rating; // 僅 assistant 訊息有評分
}

export interface Conversation {
  id: string;
  title: string; // 自動取對話第一句做標題
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string; // 最後一則訊息預覽
}

// ===== API 請求 / 回應型別 =====

export interface SendMessageRequest {
  conversationId: string;
  content: string;
}

export interface RateMessageRequest {
  messageId: string;
  rating: Rating;
}
