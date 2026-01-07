"use client";
import ContinueButton from "@/components/ContinueButton";
import MenuButton from "@/components/MenuButton";
import BackContinueButtonContainer from "@/components/new/back-continue-button-container";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useRouter } from "next/navigation";

const UploadPage = () => {
  let router = useRouter();
  const [selected, setSelected] = useState(1);
  const [continueAvailable, setContinueAvailable] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>("");

  useEffect(() => {
    let newSessionId = localStorage.getItem("sessionId");
    let sessionPassword = localStorage.getItem("sessionPassword");
    if (!newSessionId) {
      // Fallback if session creation failed earlier
      const initSession = async () => {
        try {
          const response = await fetch("/api/create-session", { method: "POST" });
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("sessionId", data.session_id);
            localStorage.setItem("sessionPassword", data.session_password);
            setSessionId(data.session_id);
            startPolling(data.session_id, data.session_password);
          }
        } catch (error) {
          console.error("Error creating session:", error);
        }
      };
      initSession();
    } else {
      setSessionId(newSessionId);
      startPolling(newSessionId, sessionPassword);
    }

    function startPolling(sid: string, spass: string | null) {
      if (selected === 2) {
        setContinueAvailable(false);
        const checkForBackground = async () => {
          try {
            const response = await fetch(
              `/api/get-background/${sid}`,
              {
                headers: {
                  "X-Session-Password": spass || "",
                },
              }
            );
            if (response.ok) {
              const blob = await response.blob();
              const objectUrl = URL.createObjectURL(blob);
              setBgImage(objectUrl);
              setContinueAvailable(true);
              console.log("Image received!");
            }
          } catch (error) {
            // Background not yet uploaded, continue polling
          }
        };

        const interval = setInterval(checkForBackground, 1000);
        checkForBackground();
        return () => clearInterval(interval);
      } else {
        setContinueAvailable(true);
        setBgImage(null);
      }
    }
  }, [selected]);

  function handleContinue() {
    if (selected === 1) {
      localStorage.setItem("option", "regular");
    } else {
      localStorage.setItem("option", "custom");
    }
    router.push("/adminpanel/livephoto");
  }

  return (
    <BackContinueButtonContainer onBack={() => { router.back() }} onContinue={continueAvailable ? handleContinue : undefined}>
      <div className="h-screen w-screen font-geist flex flex-col items-center justify-center p-8">
        <div className="p-12 flex flex-col items-center gap-12 glass-panel rounded-2xl border border-neon-blue/30 shadow-[0_0_30px_rgba(0,112,243,0.1)] max-w-5xl w-full mx-4 animate-in fade-in zoom-in duration-500 bg-white/70">
          <h1 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-sm">Choose Your Background</h1>

          <div className="flex gap-20 justify-center">
            <MenuButton
              title="Normal background"
              isSelected={selected === 1}
              onClick={() => setSelected(1)}
            />
            <MenuButton
              title="Upload background"
              isSelected={selected === 2}
              onClick={() => setSelected(2)}
            />
          </div>

          {selected === 1 ? (
            <img
              className="max-h-[400px] w-auto flex-none rounded border-2 border-neon-blue/50 shadow-md"
              src="/images/regularbg.png"
              alt="Regular background"
            />
          ) : (
            <div className="w-full flex justify-center items-center gap-40">
              <div className="flex flex-col justify-center items-center overflow-hidden gap-4">
                <h3 className="text-xl text-slate-700">Scan to upload:</h3>
                <div className="border-2 border-neon-blue/20 rounded-xl p-4 bg-white shadow-sm">
                  {sessionId && (
                    <QRCode
                      value={`${window.location.origin}/user/uploadbg?session=${sessionId}&password=${localStorage.getItem(
                        "sessionPassword"
                      )}`}
                      size={250}
                    />
                  )}
                </div>
              </div>
              <img
                className="aspect-7/5 object-cover w-[400px] h-fit flex-none rounded border-2 border-neon-blue/50 shadow-md"
                src={bgImage ?? "/images/not-uploaded.png"}
                alt="Uploaded background"
              />
            </div>
          )}
        </div>
      </div>
    </BackContinueButtonContainer>
  );
};

export default UploadPage;
