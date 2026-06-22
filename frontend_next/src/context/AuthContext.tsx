"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface User {
  id: string;
  userName: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string, userData: User) => void;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("accessToken");
      if (token) {
        try {
          const userId = Cookies.get("userId");
          const email = Cookies.get("email");
          const userName = Cookies.get("userName");
          const profileImage = Cookies.get("profileImage");
          if (userId && email && userName) {
            setUser({
              id: userId,
              email: email,
              userName: userName,
              profileImage: profileImage || undefined,
            });
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token verification failed", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Dev-safe cookie options: secure:false + sameSite:"lax" so cookies work over http://localhost.
  // For production, set secure:true and sameSite:"strict" (or use env-based logic).
  const cookieOptions = {
    secure: false,        // ← must be false for http:// dev server; set true in prod (HTTPS)
    sameSite: "lax" as const,
    expires: 7,
  };

  const login = (accessToken: string, refreshToken: string, userData: User) => {
    Cookies.set("accessToken", accessToken, cookieOptions);
    Cookies.set("refreshToken", refreshToken, cookieOptions);
    Cookies.set("profileImage", userData.profileImage || "", cookieOptions);
    Cookies.set("email", userData.email || "", cookieOptions);
    Cookies.set("userName", userData.userName || "", cookieOptions);
    Cookies.set("userId", userData.id.toString(), cookieOptions);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("profileImage");
    Cookies.remove("email");
    Cookies.remove("userName");
    Cookies.remove("userId");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = (userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...userData };
      if (userData.userName) {
        Cookies.set("userName", userData.userName, cookieOptions);
      }
      if (userData.email) {
        Cookies.set("email", userData.email, cookieOptions);
      }
      if (userData.profileImage !== undefined) {
        Cookies.set("profileImage", userData.profileImage || "", cookieOptions);
      }
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
