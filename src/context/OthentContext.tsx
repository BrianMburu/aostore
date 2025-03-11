"use client";

// contexts/OthentContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Othent, AppInfo, UserDetails } from "@othent/kms";

interface OthentContextProps {
  user: UserDetails | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  othent: Othent;
}

const OthentContext = createContext<OthentContextProps | undefined>(undefined);

interface ProviderProps {
  children: ReactNode;
}

export const OthentProvider: React.FC<ProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Application info configuration
  const appInfo: AppInfo = {
    name: "Your App Name",
    version: "1.0.0",
    env: process.env.NODE_ENV === "production" ? "production" : "development",
  };

  // Initialize Othent without using built-in cookie persistence
  const othent = new Othent({
    appInfo,
    throwErrors: false,
  });

  // Listen for errors from Othent
  othent.addEventListener("error", (err) => {
    console.error("Othent error:", err);
  });

  // On mount, fetch session details from our API endpoint
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/session");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user); // API returns { user: UserDetails }
        }
      } catch (error) {
        console.error("Session fetch failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, []);

  const login = async () => {
    try {
      await othent.connect();
      const userDetails = othent.getSyncUserDetails();
      setUser(userDetails);

      // Call our login endpoint to create the session cookie
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userDetails }),
      });
      if (!res.ok) {
        throw new Error("Failed to create session on server");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      await othent.disconnect();
      setUser(null);
      // Call our logout endpoint to delete the session cookie
      const res = await fetch("/api/logout", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Failed to delete session on server");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <OthentContext.Provider value={{ user, loading, login, logout, othent }}>
      {children}
    </OthentContext.Provider>
  );
};

export const useOthent = (): OthentContextProps => {
  const context = useContext(OthentContext);
  if (!context) {
    throw new Error("useOthent must be used within an OthentProvider");
  }
  return context;
};
