"use client";
import ContinueButton from "@/components/ContinueButton";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePhotoContext } from "@/lib/PhotoContext";
import BackContinueButtonContainer from "@/components/new/back-continue-button-container";

const imageWidth = 800;
const imageHeight = 570;
const imageX = 51;
const YInterval = 66;
const imageY = 406;

const LivePhotoPage = () => {
  const router = useRouter();
  const { setEditedPhotos, setSourceX, setSourceY } = usePhotoContext();
  const [option, setOption] = useState<string | null>("option");
  const [sessionId, setSessionId] = useState<string | null>("sessionId");
  const [available, setAvailable] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<Blob[]>([]);
  const [photoTaking, setPhotoTaking] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(true);

  // Note: I need to check if the camera permission is enabled before I can display the 3.
  const counter = useRef<HTMLParagraphElement>(null);
  const camera = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const canvasCopy = useRef<HTMLCanvasElement>(null);
  async function showCamera() {
    let stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (camera.current) {
      camera.current.srcObject = stream;
    }
  }

  async function sendAndRetrieveSingularImage(imageBlob: any) {
    const formData = new FormData();

    formData.append("file", imageBlob);
    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to remove background.");
      }
      const blob = await response.blob();
      return blob;

    } catch (err) {
      console.error(err);
    }
  }

  async function sendAndRetrieveImages() {
    router.push("/adminpanel/loading");

    const results = await Promise.all(
      capturedPhotos.map((photo) => sendAndRetrieveSingularImage(photo))
    );

    const successfulPhotos = results.filter((blob) => blob !== null) as Blob[];
    setEditedPhotos(successfulPhotos);
    setSourceX(canvas.current?.width || 0);
    setSourceY(canvas.current?.height || 0);

    router.push("/adminpanel/decorate");
  }

  function capturePhoto(photoNum: number) {
    // Extremely complicated code. I need to neaten this up.
    if (counter.current) {
      setTimeout(() => {
        counter.current!.textContent = "2";
        setCanvasVisible(false);
        setTimeout(() => {
          counter.current!.textContent = "1";
          setCanvasVisible(false);
          setTimeout(() => {
            counter.current!.textContent = "0";
            setCanvasVisible(true);
            // Snap photo
            let copyCtx = canvasCopy.current!.getContext("2d");
            canvasCopy.current!.width = camera.current!.videoWidth;
            canvasCopy.current!.height = camera.current!.videoHeight;
            setSourceX(camera.current!.videoWidth);
            setSourceY(camera.current!.videoHeight);
            copyCtx!.drawImage(camera.current!, 0, 0);
            canvasCopy.current!.toBlob((blob) => {
              if (!blob) return;
              setCapturedPhotos((prev) => [...prev, blob]);

              const objectURL = URL.createObjectURL(blob);
              drawToStrip(objectURL, canvas.current!, photoNum);

              setTimeout(() => {
                if (photoNum === 3) {
                  setAvailable(true);
                  setPhotoTaking(false);
                  return;
                }
                counter.current!.textContent = "3";
                setCanvasVisible(false);

                if (photoNum < 3) capturePhoto(photoNum + 1);
              }, 1000);
            });
          }, 1000);
        }, 1000);
      }, 1000);
    }
  }

  const drawToStrip = (
    url: string,
    canvas: HTMLCanvasElement,
    photoNum: number
  ) => {
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      let { sx, sy, sw, sh } = getCoverCoordinates(
        img.width,
        img.height,
        700,
        500
      );
      // CLEAR previous drawing if needed, or calculate offset for 2nd/3rd photo
      // ctx?.clearRect(0, 0, canvas.width, canvas.height);

      // Perform your "Object Fit" math here (as discussed previously)
      // For now, drawing it simply:
      if (photoNum === 1)
        ctx?.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          imageX,
          imageY,
          imageWidth,
          imageHeight
        );
      else if (photoNum === 2)
        ctx?.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          imageX,
          imageY + YInterval + imageHeight,
          imageWidth,
          imageHeight
        );
      else if (photoNum === 3)
        ctx?.drawImage(
          img,
          sx,
          sy,
          sw,
          sh,
          imageX,
          imageY + (YInterval + imageHeight) * 2,
          imageWidth,
          imageHeight
        );
    };

    img.src = url; // Trigger the load
  };

  function getCoverCoordinates(
    srcW: number,
    srcH: number,
    targetW: number,
    targetH: number
  ) {
    const srcRatio = srcW / srcH;
    const targetRatio = targetW / targetH;

    let sx, sy, sw, sh;

    if (srcRatio > targetRatio) {
      // Source is WIDER than target (Crop Left/Right)
      sh = srcH;
      sw = srcH * targetRatio;
      sx = (srcW - sw) / 2; // Center the crop
      sy = 0;
    } else {
      // Source is TALLER than target (Crop Top/Bottom)
      sw = srcW;
      sh = srcW / targetRatio;
      sx = 0;
      sy = (srcH - sh) / 2; // Center the crop
    }

    return { sx, sy, sw, sh };
  }

  async function capturePhotos() {
    setCapturedPhotos([]);
    setPhotoTaking(true);

    capturePhoto(1);
  }

  useEffect(() => {
    setSessionId(localStorage.getItem("sessionId"));
    setOption(localStorage.getItem("option"));
    const image = new Image();
    image.src = "/images/blank-photostrip.png";

    image.onload = () => {
      if (canvas.current) {
        const ctx = canvas.current.getContext("2d");
        ctx?.drawImage(
          image,
          0,
          0,
          canvas.current.width,
          canvas.current.height
        );
      }
    };

    showCamera();
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video
        autoPlay
        ref={camera}
        className="absolute inset-0 w-full h-full object-cover"
      />

    {/* absolute top-1/2 -translate-y-1/2 right-52 */}
      <canvas
        ref={canvas}
        height="2700"
        width="900"
        className={`absolute m-auto inset-0 bg-black h-[540px] w-[180px] z-10 transition-opacity duration-500 ${
          canvasVisible ? "opacity-100" : "opacity-0"
        }`}
      />
      <canvas ref={canvasCopy} className="hidden"></canvas>

      <p
        ref={counter}
        className="absolute inset-0 flex items-center justify-center text-[#ffffff81] text-[10rem] z-0 pointer-events-none"
      >
        3
      </p>

      <div className="relative z-10 p-10 flex flex-col justify-center items-center h-screen">

        <div className="bg-black/20 shadow-md text-white bg-opacity-70 rounded-xl px-10 py-4 flex flex-col justify-center items-center gap-2 absolute top-20">
          <h1 className="text-4xl font-bold text-center">Phototaking Time!</h1>
          <p className="text-lg">Be sure to smile at the camera! 😁</p>
        </div>

        <BackContinueButtonContainer onBack={() => router.push("/adminpanel/page")} onContinue={available ? () => {
          sendAndRetrieveImages();
        } : undefined}>
          <div className="flex flex-col gap-20 justify-center items-center px-5">
          </div>
        </BackContinueButtonContainer>

        <button
          onClick={capturePhotos}
          className={`absolute bottom-10 rounded-2xl text-white text-xl font-normal bg-[#2C7AFC] px-6 py-2 hover:cursor-pointer ${photoTaking ? "pointer-events-none bg-[#9c9696]" : null
            }`}
        >
          Capture
        </button>
      </div>

    </div>
  );
};

export default LivePhotoPage;
