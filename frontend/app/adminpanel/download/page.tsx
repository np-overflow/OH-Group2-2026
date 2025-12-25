"use client";
import ContinueButton from "@/components/ContinueButton";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

let sessionId;

const DownloadPage = () => {
  let router = useRouter();
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>("");
  const [imageLoad, setImageLoad] = useState(false);
  const photostrip = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setSessionId(localStorage.getItem("sessionId"));
    setDownloadUrl(localStorage.getItem("download"));
    if (photostrip.current) {
    }
    photostrip.current!.onload = () => {
      setImageLoad(true);
    };
  }, []);

  return (
    <div className="h-screen relative bg-[#f9f9ff] z-3">
      <h1 className="p-8 text-center font-bold text-4xl bg-[#f9f9ff] z-3 relative">
        Download
      </h1>
      <div className="h-[50px] w-full absolute right-0 bg-[#f9f9ff] z-3"></div>
      <div className="mb-[50px]"></div>
      <div className="flex items-start justify-center gap-60 bg-[#f9f9ff]">
        <div className="w-min">
          <div className="p-4 border-2 rounded mt-8">
            <QRCode size={350} value={downloadUrl ? downloadUrl : "#"} />
          </div>
          <p className="px-10 py-4 text-center">
            Scan the QR Code while we print the photos out for you!!
          </p>
        </div>
        <div className="relative flex flex-col items-center">
          <img
            src="/images/newtopphotoslot.png"
            className="w-[250px] relative z-2 top-0"
          ></img>
          <img
            src="/images/newbottomphotoslot.png"
            className="w-[250px] relative z-0 "
          />
          <img
            onLoad={() => setImageLoad(true)}
            ref={photostrip}
            src={downloadUrl!}
            className={`w-[160px] relative bottom-126 z-1 ${imageLoad ? "animate-down" : "null"}`}
          />
        </div>
      </div>
      <ContinueButton
        onClick={() => {
          router.push("/adminpanel");
        }}
        title="Back"
        isAvailable={true}
      />
    </div>
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
