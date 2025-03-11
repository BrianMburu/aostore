// components/WithSession.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { validateSessionClient } from "@/helpers/session";
import { WaveLoader } from "./animations/WaveLoader";

export const WithSession = ({ children }: { children: React.ReactNode }) => {
  const { user, isConnected } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      const { isValid } = await validateSessionClient();
      if (!isValid) router.replace("/");
    };

    verifySession();
  }, [user, isConnected, router]);

  if (!isConnected || !user) return <WaveLoader />;

  return <>{children}</>;
};
