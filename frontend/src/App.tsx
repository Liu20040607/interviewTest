import { NavLink, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./component/sidebar";
import UserInfo from "./pages/UserInfo";
import SystemSettings from "./pages/SystemSettings";
import UserManagement from "./pages/UserManagement";
import StaffManagement from "./pages/StaffManagement";
import GaiChat from "./pages/GaiChat";

const settingsTabs = [
  { label: "使用者資訊", path: "/user-info" },
  { label: "系統設定", path: "/system-settings" },
  { label: "使用者管理", path: "/user-management" },
  { label: "人員管理", path: "/staff-management" },
];

function App() {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith("/chat");

  return (
    <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* GAI 聊天頁面：無上方標題列和 Tab，直接佔滿 */}
        {isChatPage ? (
          <div className="flex-1 overflow-hidden min-h-0">
            <Routes>
              <Route path="/chat" element={<GaiChat />} />
            </Routes>
          </div>
        ) : (
          <>
            <header className="h-16 bg-white shadow-sm flex items-center px-8 sticky top-0 z-10 shrink-0">
              <h1 className="text-xl font-semibold text-gray-800">設定</h1>
            </header>

            <div className="flex flex-row gap-4 px-8 py-4 shrink-0">
              {settingsTabs.map((tab) => (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded ${
                      isActive ? "bg-green-600 text-white" : " text-blue-700 "
                    }`
                  }
                >
                  {tab.label}
                </NavLink>
              ))}
            </div>

            <div className="flex-1 p-8 overflow-y-auto">
              <Routes>
                <Route path="/" element={<Navigate to="/chat" replace />} />
                <Route path="/user-info" element={<UserInfo />} />
                <Route path="/system-settings" element={<SystemSettings />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/staff-management" element={<StaffManagement />} />
              </Routes>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
