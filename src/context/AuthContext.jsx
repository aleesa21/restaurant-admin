import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Helper function to handle user session and RPC check
    const checkUserAndRole = async (session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        try {
          const { data, error } = await supabase.rpc("is_superadmin");

          if (error) {
            console.error("Error checking superadmin status:", error);
            setIsSuperAdmin(false);
          } else {
            setIsSuperAdmin(!!data);
            console.log(data);
          }
        } catch (err) {
          console.error("RPC call failed:", err);
          setIsSuperAdmin(false);
        }
      } else {
        setIsSuperAdmin(false);
      }

      setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUserAndRole(session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        checkUserAndRole(session);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsSuperAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, loading, isSuperAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
