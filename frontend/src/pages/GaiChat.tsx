import { Plus, Send, Bot, Loader2, AlertCircle } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { MessageBubble } from "../component/MessageBubble";
import { ConversationItem } from "../component/ConversationItem";

export default function GaiChat() {
  const {
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
  } = useChat();

  return (
    <div className="flex h-full overflow-hidden bg-gray-50">
      {/* 左側：對話列表 */}
      <aside className="w-72 shrink-0 flex flex-col border-r border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-700">聊天紀錄</h2>
          <button
            onClick={handleNewConversation}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={14} />
            新對話
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 ? (
            <p className="text-center text-sm text-gray-400 mt-8">
              尚無對話紀錄
            </p>
          ) : (
            conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeId}
                onClick={() => setActiveId(conv.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* 右側：聊天室 */}
      <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <header className="px-6 py-4 bg-white border-b border-gray-200 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                {conversations.find((c) => c.id === activeId)?.title ??
                  "AI 助理"}
              </h3>
              <p className="text-xs text-gray-400">
                {activeMessages.length} 則訊息 ・ 可對 AI 回覆進行星星評分
              </p>
            </div>
          </div>
        </header>

        {/* 訊息區域 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {isFetchingMsgs ? (
            <div className="flex justify-center mt-12">
              <Loader2 size={28} className="text-emerald-400 animate-spin" />
            </div>
          ) : activeMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Bot size={32} className="text-emerald-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-600">開始新對話</h4>
              <p className="text-sm text-gray-400 mt-1">
                輸入您的問題，AI 助理將為您解答
              </p>
            </div>
          ) : (
            activeMessages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} onRate={handleRate} />
            ))
          )}

          {isLoading && (
            <div className="flex gap-3">
              <div className="shrink-0 w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-tl-sm px-4 py-3">
                <Loader2 size={18} className="text-emerald-500 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 輸入列 */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="輸入問題… (Enter 送出，Shift+Enter 換行)"
              rows={1}
              className="flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent max-h-32 overflow-y-auto"
              style={{ minHeight: "48px" }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0 w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white flex items-center justify-center transition-colors"
              title="送出 (Enter)"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-1.5 text-xs text-gray-400 text-center">
            AI 可能產生不準確資訊，請自行核實重要內容
          </p>
        </div>
      </main>
    </div>
  );
}
