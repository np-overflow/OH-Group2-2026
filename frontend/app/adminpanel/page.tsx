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
        <div className="p-8 flex flex-col items-center font-geist gap-8 bg-radial from-[#7E83D3] to-[#F9F9FF] to-50% rounded-2xl">
          <h1 className="text-4xl font-bold text-center">Welcome to the Digital Photobooth!</h1>
          <img
            src="/images/regularbg.png"
            className="max-h-120"
            alt="Welcome"
          />
          <p className="text-lg text-center">Made with ❤️ by NP Overflow</p>
        </div>
      </div>
    </BackContinueButtonContainer>
  );
}
