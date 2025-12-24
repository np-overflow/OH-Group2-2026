"use client";
import ContinueButton from "@/components/ContinueButton";
import React, { useEffect, useRef, useState } from "react";

const LivePhotoPage = () => {
  // Note: I need to check if the camera permission is enabled before I can display the 3.
  const camera = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  async function showCamera() {
    let stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (camera.current) {
      camera.current.srcObject = stream;
    }
  }
  useEffect(() => {
    const image = new Image();
    image.src = "/images/blank-photostrip.png";

    image.onload = () => {
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        ctx?.drawImage(image, 0, 0, canvas.current.width, canvas.current.height)
      }
    };

    showCamera();
  }, []);

  return (
    <div className="p-10 flex flex-col justify-around gap-10">
      <h1 className="text-4xl font-bold text-center">Phototaking</h1>
      <div className="flex gap-60 justify-center">
        <div className="flex flex-col gap-10 justify-between items-center">
          <div className="relative">
            <video
              autoPlay
              ref={camera}
              className="object-cover aspect-7/5 w-[700px] bg-[url(/images/no-video.png)] bg-cover rounded border-black border-2 "
            ></video>
            <p className="absolute inset-0 flex items-center justify-center text-[#ffffff4d] text-[10rem] pointer-events-none">
              3
            </p>
          </div>

          <button className="rounded-md text-white text-xl font-normal bg-[#2C7AFC] px-10 py-4 hover:cursor-pointer">
            Capture
          </button>
        </div>
        <canvas
          ref={canvas}
          height="2700"
          width="900"
          className="bg-black flex-none h-[540px] w-[180px]"
        ></canvas>
      </div>
      <ContinueButton onClick={() => {}}title="Continue" isAvailable={false} />
    </div>
  );
};

export default LivePhotoPage;
