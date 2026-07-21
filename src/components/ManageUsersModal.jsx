import React, { useState, useEffect } from "react";
import { X, UserPlus, ShieldCheck, Mail, Lock } from "lucide-react";
import { supabase } from "../supabaseClient";

function ManageUsersModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#18110C] border border-[#B8874F]/40 rounded-2xl shadow-2xl p-6 text-[#EFE6DA] relative max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-[#B8874F]/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#B8874F]" size={22} />
            <h2 className="text-xl font-serif font-bold text-[#EFE6DA]">
              Manage System Users
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#EFE6DA]/60 hover:text-[#EFE6DA] hover:bg-[#B8874F]/20 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="new-admin-form">
          <form action="">
            <input type="text" />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ManageUsersModal;
