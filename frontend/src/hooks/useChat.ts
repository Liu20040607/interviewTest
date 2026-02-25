import { useState, useRef, useEffect } from "react";
import type { Conversation, Message, Rating } from "../schemas/chat";
import { api } from "../services/api";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMsgs, setIsFetchingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeMessages = activeId ? (messages[activeId] ?? []) : [];

  // 載入對話清單
  useEffect(() => {
    api.getConversations().then((convs) => {
      setConversations(convs);
      if (convs.length > 0) setActiveId(convs[0].id);
    });
  }, []);

  // 切換對話時載入訊息（有快取則跳過）
  useEffect(() => {
    if (!activeId || messages[activeId]) return;
    setIsFetchingMsgs(true);
    api
      .getMessages(activeId)
      .then((msgs) => setMessages((prev) => ({ ...prev, [activeId]: msgs })))
      .finally(() => setIsFetchingMsgs(false));
  }, [activeId]);

  // 自動捲到最新訊息
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages.length]);

  async function handleNewConversation() {
    const conv = await api.createConversation();
    setConversations((prev) => [conv, ...prev]);
    setMessages((prev) => ({ ...prev, [conv.id]: [] }));
    setActiveId(conv.id);
  }

  async function handleSend() {
    if (!input.trim() || isLoading || !activeId) return;

    const content = input.trim();
    setInput("");
    setIsLoading(true);
    setError(null);

    const tempId = `temp-${Date.now()}`;
    const tempUserMsg: Message = {
      id: tempId,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      rating: null,
    };
    setMessages((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), tempUserMsg],
    }));

    try {
      const aiMsg = await api.sendMessage(activeId, content);
      const freshMsgs = await api.getMessages(activeId);
      setMessages((prev) => ({ ...prev, [activeId]: freshMsgs }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                updatedAt: aiMsg.timestamp,
                lastMessage: aiMsg.content.slice(0, 50),
                messageCount: freshMsgs.length,
                title:
                  c.messageCount === 0
                    ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
                    : c.title,
              }
            : c,
        ),
      );
    } catch {
      setError("訊息發送失敗，請稍後再試");
      setMessages((prev) => ({
        ...prev,
        [activeId]: (prev[activeId] ?? []).filter((m) => m.id !== tempId),
      }));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRate(messageId: string, rating: Rating) {
    if (!activeId) return;
    setMessages((prev) => ({
      ...prev,
      [activeId]: prev[activeId].map((m) =>
        m.id === messageId ? { ...m, rating } : m,
      ),
    }));
    try {
      await api.rateMessage(messageId, rating);
    } catch {
      const msgs = await api.getMessages(activeId);
      setMessages((prev) => ({ ...prev, [activeId]: msgs }));
    }
  }

  return {
    conversations,
    activeId,
    setActiveId,
    activeMessages,
    input,
    setInput,
    isLoading,
    isFetchingMsgs,
    error,
    bottomRef,
    handleNewConversation,
    handleSend,
    handleRate,
  };
}
