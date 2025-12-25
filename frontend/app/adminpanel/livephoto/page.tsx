"use client";
import ContinueButton from "@/components/ContinueButton";
import React, { FormEvent, useEffect, useRef, useState } from "react";
import DecoratePage from "../decorate/DecoratePage";
import LoadingPage from "@/components/LoadingPage";

const imageWidth = 800;
const imageHeight = 570;
const imageX = 51;
const YInterval = 66;
const imageY = 406;

const LivePhotoPage = () => {
  
  const [option, setOption] = useState<string|null>("option")
  const [sessionId, setSessionId] = useState<string|null>("sessionId")
  const [displayPage, setDisplayPage] = useState("livephoto");
  const [available, setAvailable] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<Blob[]>([]);
  const [editedPhotos, setEditedPhotos] = useState<Blob[]>([])
  const [sourceX, setSourceX] = useState(0)
  const [sourceY, setSourceY] = useState(0)
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
      
      setEditedPhotos((prev) => [...prev, blob]);
    } catch (err) {
      console.error(err);
    }
  }

  async function sendAndRetrieveImages() {
    setDisplayPage("loading")
    console.log("hi")
    // route first to loading page
    // Send to bg api, retrieve, paint on new canvas. repeat.
    await Promise.all 
    (capturedPhotos.map((photo) => sendAndRetrieveSingularImage(photo)))

    setDisplayPage("decorate")
  }

  function capturePhoto(photoNum: number) {
    // Extremely complicated code. I need to neaten this up.
    if (counter.current) {
      setTimeout(() => {
        counter.current!.textContent = "2";
        setTimeout(() => {
          counter.current!.textContent = "1";
          setTimeout(() => {
            counter.current!.textContent = "0";
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
                  return;
                }
                counter.current!.textContent = "3";

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
    setCapturedPhotos([])
    capturePhoto(1);
  }

  useEffect(() => {
    setSessionId(localStorage.getItem("sessionId"))
    setOption(localStorage.getItem("option"))
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

  if (displayPage === "livephoto") {
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
              <p
                ref={counter}
                className="absolute inset-0 flex items-center justify-center text-[#ffffff4d] text-[10rem] pointer-events-none"
              >
                3
              </p>
            </div>

            <button
              onClick={capturePhotos}
              className="rounded-md text-white text-xl font-normal bg-[#2C7AFC] px-10 py-4 hover:cursor-pointer"
            >
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
        <ContinueButton
          onClick={() => {
            sendAndRetrieveImages();
          }}
          title="Continue"
          isAvailable={available}
        />
        <canvas ref={canvasCopy} className="hidden"></canvas>
      </div>
    );
  } else if (displayPage === "loading") {
    return <LoadingPage />;
  } else {
    return editedPhotos!.length == 3 ? (<DecoratePage imageBlobs={editedPhotos} sourceX={sourceX} sourceY={sourceY}/>) : (<LoadingPage/>)
  }
};

export default LivePhotoPage;
/* 
console.log(blob)
      let imageAfter = new Image()
      imageAfter.src = URL.createObjectURL(blob)
      await imageAfter.decode()
      let ctx = canvas.current!.getContext("2d");
      let {sx, sy, sw, sh} = getCoverCoordinates(imageAfter.width, imageAfter.height, 700, 500)
      ctx?.drawImage(
        imageAfter,
        sx,
        sy,
        sw,
        sh,
        imageX,
        imageY,
        imageWidth,
        imageHeight
      );
*/