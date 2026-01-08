"use client";
import ContinueButton from "@/components/ContinueButton";
import BackContinueButtonContainer from "@/components/new/back-continue-button-container";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

let sessionId;

const DownloadPage = () => {
  let router = useRouter();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>("");
  const [imageLoad, setImageLoad] = useState(false);
  const [qrUrl, setQrUrl] = useState<string>("");
  const photostrip = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setSessionId(localStorage.getItem("sessionId"));
    const url = localStorage.getItem("download");
    setDownloadUrl(url);

    // Encode the URL to base64 and create QR code URL
    if (url) {
      const encoded = btoa(url);
      const fullUrl = `${window.location.origin}/user/getimage?image=${encoded}`;
      setQrUrl(fullUrl);
    }

    if (photostrip.current) {
    }
    photostrip.current!.onload = () => {
      setImageLoad(true);
    };
  }, []);

  return (
    <BackContinueButtonContainer onContinue={() => {
      router.replace("/adminpanel");
    }} restart={true} continueText="Restart">
      <div className="h-screen w-screen font-geist flex flex-col items-center justify-center p-8 relative z-2">
        <div className="p-12 flex flex-col items-center gap-12 glass-panel rounded-2xl border border-neon-blue/30 shadow-[0_0_30px_rgba(0,112,243,0.1)] max-w-7xl w-full mx-4 animate-in fade-in zoom-in duration-500 bg-white/70">
          <h1 className="font-extrabold text-4xl text-center text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-sm bg-white">
            Download Your Photostrip
          </h1>

          <div className="flex items-center justify-center gap-20">
            <div className="w-min flex flex-col items-center gap-4">
              <h3 className="text-xl text-slate-700 font-semibold">Scan to Download:</h3>
              <div className="p-4 border-2 border-neon-blue/20 rounded-xl bg-white shadow-sm">
                <QRCode size={350} value={qrUrl || "#"} />
              </div>
              <p className="px-10 py-2 text-center text-slate-600">
                Scan the QR Code to get your Photostrip!
              </p>
            </div>

            <div className="relative flex flex-col items-center">
              <img
                src="/images/newtopphotoslot.png"
                className="w-[300px] relative z-2 top-0"
              />
              <img
                src="/images/newbottomphotoslot.png"
                className="w-[300px] relative z-0"
              />
              <img
                onLoad={() => setImageLoad(true)}
                ref={photostrip}
                src={downloadUrl!}
                className={`w-[180px] h-[540px] relative bottom-[45px] z-1 ${imageLoad ? "null" : "null"}`}
              />
            </div>
          </div>
        </div>
      </div>
    </BackContinueButtonContainer>
  );
};

export default DownloadPage;
/* 
<div className="flex flex-col h-full gap-10">
        <h1 className="text-center font-bold text-4xl">Download</h1>
        <div className="flex px-20 justify-center items-center h-full">
          

          <img src="/images/regularbg.png" className="max-w-[600px]"></img>
        </div>
      </div>
      <ContinueButton title="Back" isAvailable={true} />
*/
