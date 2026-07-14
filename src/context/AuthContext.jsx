import { useContext } from "react";
import { createContext } from "react";
import { Outlet } from "react-router";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const user="alisha"
  return (
    <AuthContext.Provider value={{user}}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
