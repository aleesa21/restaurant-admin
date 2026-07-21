import React, { useState, useEffect } from "react";
import {
  X,
  UserRoundPlus,
  ShieldCheck,
  Mail,
  Lock,
  UserRoundKey,
  LockKeyholeOpen,
  Trash2,
} from "lucide-react";
import { supabase } from "../supabaseClient";

function ManageUsersModal({ isOpen, onClose }) {
  const [formvalues, setFormvalues] = useState({ email: "", password: "" });

  const handleUserValidate = (e) => {
    e.preventDefault();
    if (!formvalues.email || !formvalues.password) {
      alert("fields cannot be empty");
      return;
    }
    console.log(formvalues);
    alert("im clicked");
  };
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
        <div className="new-admin-form border mb-4 border-[#B8874F]/40 bg-[#0F0B08] rounded-xl p-5">
          <div className=" flex items-center  gap-2 text-[#B8874F] font-semibold">
            <UserRoundPlus size={16} />

            <h2 className="uppercase">add new admin / users</h2>
          </div>
          <form onSubmit={handleUserValidate}>
            <div className="grid grid-cols-2 my-4 gap-3">
              <div className="relative w-full">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8874F]/60 pointer-events-none"
                />
                <input
                  type="email"
                  placeholder="User Email"
                  onChange={(e) => {
                    setFormvalues((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                  className="w-full bg-[#18110C] border border-[#B8874F]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none focus:border-[#B8874F] transition-colors"
                />
              </div>
              <div className="relative w-full">
                <UserRoundKey
                  size={16}
                  className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none "
                />
                <input
                  className="w-full bg-[#18110C] border border-[#B8874F]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none focus:border-[#B8874F] transition-colors"
                  type="text"
                  name=""
                  id=""
                  placeholder="Role"
                />
              </div>
              <div className="relative w-full">
                <Lock
                  size={16}
                  className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none "
                />
                <input
                  onChange={(e) => {
                    setFormvalues((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                  className="w-full bg-[#18110C] border border-[#B8874F]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none focus:border-[#B8874F] transition-colors"
                  type="password"
                  name=""
                  id=""
                  placeholder="Password"
                />
              </div>
              <div className="relative w-full">
                <LockKeyholeOpen
                  size={16}
                  className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none "
                />
                <input
                  className="w-full bg-[#18110C] border border-[#B8874F]/30 rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none focus:border-[#B8874F] transition-colors"
                  type="password"
                  name=""
                  id=""
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full text-center content-center cursor-pointer  bg-[#B8874F] hover:bg-[#CE9A5E] px-5 py-2 rounded-md text-sm font-bold text-[#12100D] shadow-md transition-colors tracking-wide uppercase"
            >
              create user account
            </button>
          </form>
        </div>
        <div className="user-table ">
          <h3 className="uppercase font-semibold mb-3 text-[#B8874F]">
            existing accounts (0)
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-[#120D09] border border-[#B8874F]/20 rounded-lg hover:border-[#B8874F]/40 transition-colors">
              <div>
                <p className="text-sm font-semibold text-[#EFE6DA]">email</p>
                <p className="text-[10px] text-[#B8874F]/75">Role: "Admin"</p>
              </div>

              <button
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer"
                title="Delete User"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsersModal;
