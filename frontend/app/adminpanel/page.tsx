"use client";

import BackContinueButtonContainer from "@/components/new/back-continue-button-container";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  let router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch("/api/create-session", { method: "POST" });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("sessionId", data.session_id);
          localStorage.setItem("sessionPassword", data.session_password);
          setSessionId(data.session_id);
        } else {
          console.error("Failed to create session:", response.statusText);
        }
      } catch (error) {
        console.error("Error creating session:", error);
      }
    };
    initSession();
  }, []);

  return (
    <BackContinueButtonContainer onContinue={() => {
      router.push("/adminpanel/uploadbg");
    }}>
      <div className="h-screen relative flex items-center justify-center">
        <div className="p-12 flex flex-col items-center font-geist gap-8 glass-panel rounded-2xl border border-neon-blue/30 shadow-[0_0_30px_rgba(0,243,255,0.1)] max-w-2xl w-full mx-4 animate-in fade-in zoom-in duration-500">
          <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text">
            Welcome to the Digital Photobooth!
          </h1>
          <div className="relative group">
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple opacity-50 blur group-hover:opacity-75 transition duration-500"></div>
            <img
              src="/images/regularbg.png"
              className="relative max-h-96 rounded-lg border-2 border-white/10"
              alt="Welcome"
            />
          </div>
          <p className="text-xl text-center text-slate-700 font-medium">
            Made with <span className="text-neon-purple">❤️</span> by NP Overflow
          </p>
        </div>
      </div>
    </BackContinueButtonContainer>
  );
}
