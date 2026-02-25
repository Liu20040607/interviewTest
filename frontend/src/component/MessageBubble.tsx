import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message, Rating } from "../../schemas/chat";
import { StarRating } from "./StarRating";

export function MessageBubble({
  message,
  onRate,
}: {
  message: Message;
  onRate: (id: string, rating: Rating) => void;
}) {
  const isUser = message.role === "user";
  const time = new Date(message.timestamp).toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser ? "bg-blue-500" : "bg-emerald-600"
        }`}
      >
        {isUser ? (
          <User size={18} className="text-white" />
        ) : (
          <Bot size={18} className="text-white" />
        )}
      </div>

      <div
        className={`min-w-0 max-w-[70%] flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      >
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{isUser ? "您" : "AI 助理"}</span>
          <span>{time}</span>
        </div>

        <div
          className={`w-full px-4 py-3 rounded-2xl text-sm leading-relaxed wrap-break-word overflow-hidden ${
            isUser
              ? "bg-blue-500 text-white rounded-tr-sm whitespace-pre-wrap"
              : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-sm"
          }`}
        >
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-4 mb-2 space-y-0.5">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-4 mb-2 space-y-0.5">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <code className="block bg-gray-100 text-gray-800 rounded-lg px-3 py-2 mt-1 mb-2 text-xs font-mono whitespace-pre">
                      {children}
                    </code>
                  ) : (
                    <code className="bg-gray-100 text-gray-800 rounded px-1 py-0.5 text-xs font-mono break-all">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="max-w-full overflow-x-auto">{children}</pre>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-gray-400">評分：</span>
            <StarRating
              value={message.rating}
              onChange={(r) => onRate(message.id, r)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
