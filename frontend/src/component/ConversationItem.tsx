import { MessageSquare } from "lucide-react";
import type { Conversation } from "../../schemas/chat";

export function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const date = new Date(conv.updatedAt).toLocaleDateString("zh-TW", {
    month: "numeric",
    day: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl transition-colors group ${
        isActive
          ? "bg-emerald-50 border border-emerald-200"
          : "hover:bg-gray-100 border border-transparent"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <MessageSquare
            size={15}
            className={
              isActive ? "text-emerald-600 shrink-0" : "text-gray-400 shrink-0"
            }
          />
          <span
            className={`text-sm font-medium truncate ${
              isActive ? "text-emerald-800" : "text-gray-700"
            }`}
          >
            {conv.title}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0">{date}</span>
      </div>
      <p className="mt-1 text-xs text-gray-400 truncate pl-5.75">
        {conv.lastMessage}
      </p>
    </button>
  );
}
