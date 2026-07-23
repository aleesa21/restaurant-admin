import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
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

const initialValues = {
  email: "",
  password: "",
  role: "",
  cpassword: "",
};

const initialErrors = {
  e_email: "",
  e_password: "",
  e_role: "",
  e_cpassword: "",
};

function ManageUsersModal({ isOpen, onClose }) {
  const [formvalues, setFormvalues] = useState(initialValues);
  const [formerrors, setFormerrors] = useState(initialErrors);
  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState();

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: { action: "list" },
      });

      if (error) throw error;
      setFetchedData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const deleteAdmin = async (user_id) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: {
          action: "delete",
          target_user_id: user_id,
        },
      });

      if (error) throw error;
      await fetchAdmins();
      alert("user deleted sucessfully");
    } catch (error) {
      console.log("delete failed", error);
    }
    console.log("im deleted", user_id);
  };

  const AddNewUser = async (e, p, r) => {
    try {
      const { data, error } = await supabase.functions.invoke("manage-admins", {
        body: {
          action: "create",
          email: e,
          password: p,
          role: r,
        },
      });

      if (error) {
        console.error("Supabase function error:", error);
        alert("Failed to create user: " + error.message);
        return;
      }

      console.log("New user created successfully:", data);
      setFormerrors(initialErrors);
      await fetchAdmins();
      setFormvalues(initialValues);
      alert("Form submitted successfully!");
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("An unexpected error occurred.");
    } finally {
      // Always stop loading whether it succeeded or failed
      setLoading(false);
    }
  };

  const handleUserValidate = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formvalues.email) {
      errors.e_email = "Email cannot be empty";
    }
    if (!formvalues.role) {
      errors.e_role = "Please select a Role";
    }
    if (!formvalues.password) {
      errors.e_password = "Password cannot be empty";
    } else if (formvalues.password.length < 6) {
      errors.e_password = "Password must be atleast 6 characters";
    }
    if (!formvalues.cpassword) {
      errors.e_cpassword = "Confirm password cannot be empty";
    } else if (formvalues.password !== formvalues.cpassword) {
      errors.e_cpassword = "Passwords do not match";
    }

    setFormerrors(errors);

    const isValid = Object.keys(errors).length === 0;

    if (isValid) {
      setLoading(true);

      AddNewUser(formvalues.email, formvalues.password, formvalues.role);
    } else {
      console.log("Validation errors:", errors);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormvalues((prev) => ({ ...prev, [name]: value }));
    if (formerrors[`e_${name}`]) {
      setFormerrors((prev) => ({ ...prev, [`e_${name}`]: "" }));
    }
  };
  const handleCloseModal = () => {
    setFormvalues(initialValues);
    setFormerrors(initialErrors);
    onClose();
  };
  if (!isOpen) return null;

  console.log(fetchedData);
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
            onClick={handleCloseModal}
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
              <div className="flex flex-col justify-start">
                <div className="relative w-full">
                  <Mail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B8874F]/60 pointer-events-none"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="User Email"
                    value={formvalues.email}
                    onChange={handleInputChange}
                    className={`w-full bg-[#18110C] border rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none transition-colors ${
                      formerrors.e_email
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#B8874F]/30 focus:border-[#B8874F]"
                    }`}
                  />
                </div>
                {formerrors.e_email && (
                  <span className="text-red-400 text-xs mt-1 ml-1 font-medium">
                    {formerrors.e_email}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-start">
                <div className="relative w-full">
                  <UserRoundKey
                    size={16}
                    className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none z-10"
                  />
                  <select
                    name="role"
                    value={formvalues.role}
                    onChange={handleInputChange}
                    className={`w-full bg-[#18110C] border rounded-lg pl-9 pr-8 py-2 text-sm text-[#EFE6DA] focus:outline-none transition-colors appearance-none cursor-pointer ${
                      formerrors.e_role
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#B8874F]/30 focus:border-[#B8874F]"
                    }`}
                  >
                    <option
                      value=""
                      disabled
                      className="bg-[#18110C] text-[#EFE6DA]"
                    >
                      Select Role
                    </option>
                    <option
                      value="admin"
                      className="bg-[#18110C] text-[#EFE6DA]"
                    >
                      Admin
                    </option>
                    <option
                      value="superadmin"
                      className="bg-[#18110C] text-[#EFE6DA]"
                    >
                      Superadmin
                    </option>
                  </select>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#B8874F]/60 text-[10px]">
                    ▼
                  </div>
                </div>
                {formerrors.e_role && (
                  <span className="text-red-400 text-xs mt-1 ml-1 font-medium">
                    {formerrors.e_role}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-start">
                <div className="relative w-full">
                  <Lock
                    size={16}
                    className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none"
                  />
                  <input
                    name="password"
                    value={formvalues.password}
                    type="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                    className={`w-full bg-[#18110C] border rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none transition-colors ${
                      formerrors.e_password
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#B8874F]/30 focus:border-[#B8874F]"
                    }`}
                  />
                </div>
                {formerrors.e_password && (
                  <span className="text-red-400 text-xs mt-1 ml-1 font-medium">
                    {formerrors.e_password}
                  </span>
                )}
              </div>

              <div className="flex flex-col justify-start">
                <div className="relative w-full">
                  <LockKeyholeOpen
                    size={16}
                    className="absolute left-3 -translate-y-1/2 top-1/2 text-[#B8874F]/60 pointer-events-none"
                  />
                  <input
                    name="cpassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={formvalues.cpassword}
                    onChange={handleInputChange}
                    className={`w-full bg-[#18110C] border rounded-lg pl-9 pr-3 py-2 text-sm text-[#EFE6DA] placeholder-[#EFE6DA]/40 focus:outline-none transition-colors ${
                      formerrors.e_cpassword
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#B8874F]/30 focus:border-[#B8874F]"
                    }`}
                  />
                </div>
                {formerrors.e_cpassword && (
                  <span className="text-red-400 text-xs mt-1 ml-1 font-medium">
                    {formerrors.e_cpassword}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-center content-center bg-[#B8874F] hover:bg-[#CE9A5E] px-5 py-2 rounded-md text-sm font-bold text-[#12100D] shadow-md transition-colors tracking-wide uppercase disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {loading ? "Creating..." : "create user account"}
            </button>
          </form>
        </div>
        <div className="user-table ">
          <h3 className="uppercase font-semibold mb-3 text-[#B8874F] flex gap-2 items-center">
            existing accounts
            <span>({fetchedData?.length})</span>
          </h3>

          <div className="space-y-2">
            {fetchedData.map((d) => {
              return (
                <div
                  key={d.user_id}
                  className="flex justify-between items-center p-3 bg-[#120D09] border border-[#B8874F]/20 rounded-lg hover:border-[#B8874F]/40 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#EFE6DA]">
                      {d.email}
                    </p>
                    <p className="text-[10px] text-[#B8874F]/75">
                      Role: {d.role}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      deleteAdmin(d.user_id);
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-colors cursor-pointer"
                    title="Delete User"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsersModal;
