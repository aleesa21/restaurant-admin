import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";
import { supabase } from "../supabaseClient";

function Login() {
  const [formvalues, setFormvalues] = useState({ email: "", password: "" });
  const [formerrors, setFormerrors] = useState({
    e_email: "",
    e_password: "",
  });
  const [apiError, setApiError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  async function handleLogin(email, password) {
    setApiError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setApiError(error.message);
        return;
      }
      navigate("/admin/dashboard");
    } catch (err) {
      setApiError("An unexpected error occurred. Please try again.");
    }
  }

  function validate(e) {
    e.preventDefault();
    let errors = {};
    if (!formvalues.email) {
      errors.e_email = "Email is required";
    }
    if (!formvalues.password) {
      errors.e_password = "Password is required";
    }
    setFormerrors(errors);

    if (Object.keys(errors).length === 0) {
      handleLogin(formvalues.email, formvalues.password);
    } else {
      console.log("Form has errors, stopping submission.");
    }
  }

  return (
    <section className="w-full h-screen overflow-hidden select-none">
      <div className="w-full h-full relative flex items-center justify-center px-6 md:px-16 lg:px-24">
        <img
          className="w-full h-full object-cover absolute inset-0 pointer-events-none"
          src="https://png.pngtree.com/thumb_back/fh260/background/20231011/pngtree-top-view-flat-lay-roasted-coffee-beans-texture-on-brown-linen-image_13638141.png"
          alt="Artisan"
        />

        <div className="absolute inset-0 bg-[#120a05]/70 backdrop-blur-[1px] pointer-events-none" />

        <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] px-8 py-10 md:px-10 md:py-12 border border-white/10 ring-1 ring-white/5 z-10">
          <form onSubmit={validate} className="flex flex-col gap-6">
            <div className="text-left">
              <h1 className="font-serif text-3xl text-[#f5e9dc] tracking-wide font-medium">
                Welcome back
              </h1>
              <div className="w-10 h-0.5 bg-[#e3a05d] mt-3 mb-2 rounded-full" />
              <p className="text-[#d4a574]/90 text-sm font-medium tracking-wide">
                Sign in to manage your café
              </p>
            </div>

            {apiError && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 px-4 py-3 rounded-xl text-xs font-medium text-center animate-fadeIn">
                {apiError}
              </div>
            )}
            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="email"
                className="text-[#d4a574] text-[11px] font-bold uppercase tracking-widest opacity-90"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                id="email"
                onChange={(e) => {
                  setFormvalues((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }));
                  if (formerrors.e_email)
                    setFormerrors((prev) => ({ ...prev, e_email: "" }));
                }}
                className={`bg-black/20 border rounded-xl text-[#f5e9dc] placeholder-[#f5e9dc]/30 px-4 py-3 text-sm outline-none transition-all duration-200 ${
                  formerrors.e_email
                    ? "border-rose-500/50 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-white/10 focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574]"
                }`}
              />
              {formerrors.e_email && (
                <div className="text-rose-400/90 text-xs font-medium tracking-wide pl-1 animate-fadeIn">
                  {formerrors.e_email}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2 text-left">
              <label
                htmlFor="password"
                className="text-[#d4a574] text-[11px] font-bold uppercase tracking-widest opacity-90"
              >
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                id="password"
                onChange={(e) => {
                  setFormvalues((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }));
                  if (formerrors.e_password)
                    setFormerrors((prev) => ({ ...prev, e_password: "" }));
                }}
                className={`bg-black/20 border rounded-xl text-[#f5e9dc] placeholder-[#f5e9dc]/30 px-4 py-3 text-sm outline-none transition-all duration-200 ${
                  formerrors.e_password
                    ? "border-rose-500/50 focus:border-rose-400 focus:ring-1 focus:ring-rose-400"
                    : "border-white/10 focus:border-[#d4a574] focus:ring-1 focus:ring-[#d4a574]"
                }`}
              />
              {formerrors.e_password && (
                <div className="text-rose-400/90 text-xs font-medium tracking-wide pl-1 animate-fadeIn">
                  {formerrors.e_password}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 bg-[#d4a574] text-[#1f100a] text-sm font-bold tracking-wider uppercase rounded-xl py-3.5 hover:bg-[#e6bb8e] active:scale-[0.99] transition-all duration-200 shadow-lg shadow-[#d4a574]/20 cursor-pointer"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
