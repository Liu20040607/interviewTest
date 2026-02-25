// src/components/Sidebar.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Calculator,
  ClipboardList,
  PenTool,
  Settings,
  MessageSquareText,
} from "lucide-react";

const menuItems = [
  { icon: <Home size={24} />, label: "unknown", path: null },
  { icon: <Calculator size={24} />, label: "unknown", path: null },
  { icon: <ClipboardList size={24} />, label: "unknown", path: null },
  { icon: <PenTool size={24} />, label: "unknown", path: null },
  { icon: <MessageSquareText size={24} />, label: "GAI 聊天", path: "/chat" },
  { icon: <Settings size={24} />, label: "系統設定", path: "/user-info" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside
      className={`relative h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex items-center justify-center p-4 border-b border-gray-700 h-16">
        <div
          className={`font-bold text-xl tracking-wider overflow-hidden whitespace-nowrap transition-opacity duration-300 ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
        >
          管理系統
        </div>
      </div>

      {/* 選單列表 */}
      <nav className="flex flex-col gap-2 p-3 mt-4">
        {menuItems.map((item, index) => {
          const isActive = item.path !== null && location.pathname.startsWith(item.path);
          return (
            <div
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors group ${
                isActive ? "bg-blue-600" : "hover:bg-blue-600"
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <div className={`shrink-0 ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                {item.icon}
              </div>
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  isOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4 hidden"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
