import React, { useState } from "react";
import { RotateCcw, Save, LogOut, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

function AdminHeader({ handleRevert, handleSave, addCategory }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userEmail = user?.email || "";
  const avatarInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "A";

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    navigate("/");
  };

  return (
    <div
      className="sticky top-0 z-50 w-full   bg-transparent"
      style={{
        background:
          "repeating-linear-gradient(135deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 2px, transparent 2px, transparent 6px), #120D09",
      }}
    >
      <header className="menu-header w-full mb-2 sticky top-0 z-100  bg-[#18110C]/90 backdrop-blur-xl rounded-lg p-6 flex justify-between items-center flex-wrap gap-4 border border-[#B8874F]/30 shadow-[0_8px_32px_0_rgba(8,5,3,0.5)]">
        <div>
          <h1 className="font-serif font-bold text-2xl capitalize text-[#EFE6DA] tracking-wide">
            Menu Dashboard
          </h1>
          <p className="text-xs font-medium text-[#B8874F]/75 mt-1 tracking-wider uppercase">
            Last published 2 hours ago
          </p>
        </div>
        <div className="flex justify-center items-center gap-6">
          <div className="m-h-btns flex gap-3">
            <button
              className="bg-transparent border border-[#B8874F]/40 hover:bg-[#B8874F]/10 text-[#B8874F] px-5 py-2.5 rounded-xl text-sm font-semibold tracking-wide capitalize cursor-pointer transition-colors flex items-center justify-center"
              onClick={addCategory}
            >
              add category
            </button>
            <button
              onClick={handleRevert}
              className="flex items-center cursor-pointer gap-2 border border-[#B8874F]/30 bg-white/[0.02] px-4 py-2 rounded-md text-sm font-medium text-[#EFE6DA] hover:bg-[#B8874F]/10 transition-colors"
            >
              <RotateCcw size={16} />
              Revert
            </button>

            <button
              onClick={handleSave}
              className="flex items-center cursor-pointer gap-2 bg-[#B8874F] hover:bg-[#CE9A5E] px-5 py-2 rounded-md text-sm font-bold text-[#12100D] shadow-md transition-colors tracking-wide uppercase"
            >
              <Save size={16} />
              Publish changes
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 rounded-full bg-[#B8874F] text-[#120D09] font-bold text-sm flex items-center justify-center border-2 border-[#B8874F]/50 hover:scale-105 transition-transform focus:outline-none shadow-md"
            >
             {avatarInitials}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-[#18110C] border border-[#B8874F]/40 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-[#B8874F]/20 mb-1">
                  <p className="text-xs text-[#B8874F] font-semibold">
                    Signed in as
                  </p>
                  <p className="text-sm font-bold text-[#EFE6DA] truncate">
                    Admin User
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#EFE6DA]/80 hover:text-[#EFE6DA] hover:bg-[#B8874F]/20 rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <UsersRound size={13} />
                  Manage Users
                </button>

                <div className="h-px bg-[#B8874F]/20 my-1" />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg flex items-center gap-2.5 transition-colors"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default AdminHeader;
