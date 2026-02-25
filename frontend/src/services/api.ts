import type { Conversation, Message, Rating } from "../schemas/chat";

const BASE = "http://localhost:8000";

// ===== 後端回應格式（snake_case）=====
interface ApiConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message: string;
}

interface ApiMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  rating: number | null;
  created_at: string;
}

// ===== 格式轉換 =====
function toConversation(r: ApiConversation): Conversation {
  return {
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    messageCount: r.message_count,
    lastMessage: r.last_message,
  };
}

function toMessage(r: ApiMessage): Message {
  return {
    id: r.id,
    role: r.role,
    content: r.content,
    timestamp: r.created_at,
    rating: (r.rating as Rating) ?? null,
  };
}

// ===== API 方法 =====
export const api = {
  async getConversations(): Promise<Conversation[]> {
    const res = await fetch(`${BASE}/api/conversations/`);
    const data: ApiConversation[] = await res.json();
    return data.map(toConversation);
  },

  async createConversation(): Promise<Conversation> {
    const res = await fetch(`${BASE}/api/conversations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "新對話" }),
    });
    const data: ApiConversation = await res.json();
    return toConversation(data);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const res = await fetch(
      `${BASE}/api/conversations/${conversationId}/messages`
    );
    const data: ApiMessage[] = await res.json();
    return data.map(toMessage);
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const res = await fetch(
      `${BASE}/api/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );
    const data: ApiMessage = await res.json();
    return toMessage(data);
  },

  async rateMessage(messageId: string, rating: Rating): Promise<Message> {
    const res = await fetch(
      `${BASE}/api/conversations/messages/${messageId}/rating`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
      }
    );
    const data: ApiMessage = await res.json();
    return toMessage(data);
  },
};
