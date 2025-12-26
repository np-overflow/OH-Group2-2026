"use client";

import ContinueButton from "@/components/ContinueButton";
import DraggableSticker from "@/components/DraggableSticker";
import LoadingPage from "@/components/LoadingPage";
import StickerButton from "@/components/StickerButton";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const imageWidth = 800;
const imageHeight = 572;
const imageX = 50;
const YInterval = 63;
const imageY = 405;
interface DecoratePageProps {
  imageBlobs: Blob[];
  sourceX: number;
  sourceY: number;
}

const DecoratePage = ({ imageBlobs, sourceX, sourceY }: DecoratePageProps) => {
  let router = useRouter();
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
  /* 
    When StickerButton is pressed, a record is added into stickerDictionary and the DraggableSticker is added
    to the sibling div of canvas. The draggablesticker is 4x smaller than its actual resolution (fixed width of 100px initially)
    The DraggableSticker will be displayed with 4x less width and height. This element's coordinates will be the accurate coordinates on how to draw to the canvas
    
    After continue is pressed, all the stickers are drawn onto the canvas, and the canvas is then exported
    How it is drawn: DraggableSticker's full res, pasted to the same coords of its element. Uses drawImage's 5 argument version: Select full image, 
    but paste only a 4x less resolution of it. in the recorded coordinates from DraggableSticker
    */

  type StickerData = {
    image: HTMLImageElement;
    width: number;
    height: number;
  };
  const canvasOverlay = useRef<HTMLDivElement>(null);
  const testLink = useRef<HTMLAnchorElement>(null);

  const canvas = useRef<HTMLCanvasElement>(null);
  const [id, setId] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [stickerCount, setStickerCount] = useState<Record<number, StickerData>>(
    {}
  );
  const [displayPage, setDisplayPage] = useState("decorate");

  useEffect(() => {
    const drawBaseStrip = async () => {
      const currentSessionId = localStorage.getItem("sessionId");
      setSessionId(currentSessionId!);
      const option = localStorage.getItem("option");
      let background = new Image();
      background.crossOrigin = "anonymous";
      if (option == "regular") {
        background.src = "/images/hq720.jpg";
      } else {
        try {
          const docRef = doc(db, "custom-bg", currentSessionId!);
          // Await the fetch so code PAUSES here until we have the data
          const snapshot = await getDoc(docRef);

          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.imageUrl) {
              console.log("Background received!", data.imageUrl);
              // FORCE NEW REQUEST: Handle existing query params (?) vs new ones
              const separator = data.imageUrl.includes("?") ? "&" : "?";
              background.src = `${data.imageUrl}${separator}time=${Date.now()}`;
            }
          }
        } catch (error) {
          console.error("Error fetching background:", error);
        }
      }
      const photostripImage = new Image();
      photostripImage.src = "/images/blank-photostrip.png";
      await photostripImage.decode();
      if (canvas.current) {
        let ctx = canvas.current.getContext("2d");
        ctx?.drawImage(photostripImage, 0, 0, 900, 2700);
        let i = 1;
        let bCoords: any;
        await background.decode();
        bCoords = getCoverCoordinates(
          background.width,
          background.height,
          700,
          500
        );

        for (const blob of imageBlobs) {
          let { sx, sy, sw, sh } = getCoverCoordinates(
            sourceX,
            sourceY,
            700,
            500
          );
          let image = new Image();
          image.src = URL.createObjectURL(blob);
          await image.decode();
          if (i === 1) {
            ctx?.drawImage(
              background,
              bCoords.sx,
              bCoords.sy,
              bCoords.sw,
              bCoords.sh,
              imageX,
              imageY,
              imageWidth,
              imageHeight
            );
            ctx?.drawImage(
              image,
              sx,
              sy,
              sw,
              sh,
              imageX,
              imageY,
              imageWidth,
              imageHeight
            );
            i += 1;
          } else if (i === 2) {
            ctx?.drawImage(
              background,
              bCoords.sx,
              bCoords.sy,
              bCoords.sw,
              bCoords.sh,
              imageX,
              imageY + imageHeight + YInterval,
              imageWidth,
              imageHeight
            );
            ctx?.drawImage(
              image,
              sx,
              sy,
              sw,
              sh,
              imageX,
              imageY + imageHeight + YInterval,
              imageWidth,
              imageHeight
            );
            i += 1;
          } else {
            ctx?.drawImage(
              background,
              bCoords.sx,
              bCoords.sy,
              bCoords.sw,
              bCoords.sh,
              imageX,
              imageY + imageHeight + YInterval + imageHeight + YInterval + 4,
              imageWidth,
              imageHeight
            );
            ctx?.drawImage(
              image,
              sx,
              sy,
              sw,
              sh,
              imageX,
              imageY + imageHeight + YInterval + imageHeight + YInterval + 4,
              imageWidth,
              imageHeight
            );
          }
        }
      }
      setDisplayPage("decorate");
    };
    drawBaseStrip();
  }, []);

  useEffect(() => {
    console.log(stickerCount[id - 1]);
  }, [stickerCount]);

  function addSticker(imgPath: string) {
    let image = new Image();
    image.src = imgPath;

    // 1. Add record to dictionary. The id will be locally stored.
    // 2. This dictionary will be looped through later.
    // 3. Add DraggableSticker component in the useRef's div, at the middle.
    // 4. DraggableSticker component will have the draggable features
    // 5. The final position of the draggablesticker needs to be obtained. The element's position is good enough
    // No data needs to be passed thru from ds to img.

    image.onload = () => {
      setStickerCount((prev) => ({
        ...prev,
        [id]: {
          image: image,
          height: image.height / 4,
          width: image.width / 4,
        },
        //
      }));
      setId((prev) => prev + 1);
    };
  }

  function addRealSticker() {
    return Object.entries(stickerCount).map(([id, stickerData]) => {
      return (
        <DraggableSticker
          imgSrc={stickerData["image"].src}
          height={stickerData["height"]}
          width={stickerData["width"]}
          key={id}
          stickerId={"stickerid-" + id}
          canvasOverlay={canvasOverlay}
        />
      );
    });
  }

  async function renderPhotostrip() {
    setDisplayPage("loading");
    // It needs to draw all the stickers on the photostrip to the canvas. We will try printing
    // the 2700px version
    Object.entries(stickerCount).map(([id, stickerData]) => {
      if (canvas.current) {
        let ctx = canvas.current.getContext("2d");
        if (ctx) {
          let stickerElement = document.querySelector(
            `.stickerid-${id}`
          ) as HTMLImageElement;
          console.log(stickerElement.offsetLeft);
          console.log(stickerElement.offsetTop);

          let image = stickerData["image"];
          let imageWidth = stickerData["width"] * 5;
          let imageHeight = stickerData["height"] * 5;
          ctx.drawImage(
            image,
            stickerElement.offsetLeft * 5,
            stickerElement.offsetTop * 5,
            imageWidth,
            imageHeight
          );
        }
      }
    });
    let pngDataURL;
    if (canvas.current) {
      pngDataURL = canvas.current.toBlob(async (blob) => {
        if (!blob) {
          console.error("Canvas to blob conversion failed.");
          return;
        }

        const storageRef = ref(storage, `photostrip/${sessionId}-strip.png`);
        const snapshot = await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("File available at", downloadURL);
        localStorage.setItem("download", downloadURL);

        router.push("/adminpanel/download");
        /*
  try {
        //Create a reference to where the file will be saved
        const storageRef = ref(storage, `custom-bg/${sessionId}/${file.name}`);
        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        //get the public URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log(downloadURL);
        setBgUrl(downloadURL);

        setStatus(true);

        //Update the database triggering admin panel upload page
        await setDoc(doc(db, "custom-bg", sessionId), {
          imageUrl: downloadURL,
        });
      } catch (error) {
        console.error("Upload failed: " + error);
      }
          */
      });
    }
  }

  return (
    <div>
      {displayPage === "loading" && <LoadingPage />}
      <div
        className={`p-8 h-screen ${
          displayPage === "loading" && "absolute z-0 top-0"
        }`}
      >
        <h1 className="text-4xl text-center mb-12 font-bold">Decorate</h1>
        <div className="flex gap-30 justify-center items-center h-[600px]">
          <div ref={canvasOverlay} className="h-[540px] w-[180px] relative">
            <canvas
              ref={canvas}
              height="2700"
              width="900"
              className="flex-none h-full w-full"
            ></canvas>
            <div className="absolute h-full w-full inset-0 flex items-center justify-center">
              {addRealSticker()}
            </div>
          </div>

          <div className="h-full flex flex-col">
            <h3 className="text-2xl font-semibold text-center mb-4">
              Stickers
            </h3>
            <div className="grid grid-cols-3 grid-rows-4 gap-10 w-80 h-full ">
              <StickerButton
                onClick={() => addSticker("/images/stickers/cheese.png")}
                stickerSrc="/images/stickers/cheese.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/cinnamoroll1.png")}
                stickerSrc="/images/stickers/cinnamoroll1.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/exclamation.png")}
                stickerSrc="/images/stickers/exclamation.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/cute-eyes.png")}
                stickerSrc="/images/stickers/cute-eyes.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/python.png")}
                stickerSrc="/images/stickers/python.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/rose.png")}
                stickerSrc="/images/stickers/rose.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/usagi.png")}
                stickerSrc="/images/stickers/usagi.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/roblox-usagi.png")}
                stickerSrc="/images/stickers/roblox-usagi.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/csharp.png")}
                stickerSrc="/images/stickers/csharp.png"
              />
              <StickerButton
                onClick={() =>
                  addSticker("/images/stickers/overflow-transparent.png")
                }
                stickerSrc="/images/stickers/overflow-transparent.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/ict.png")}
                stickerSrc="/images/stickers/ict.png"
              />
              <StickerButton
                onClick={() => addSticker("/images/stickers/ngeeann.png")}
                stickerSrc="/images/stickers/ngeeann.png"
              />
            </div>
          </div>
        </div>
        <ContinueButton
          onClick={() => {
            renderPhotostrip();
          }}
          isAvailable={true}
          title="Continue"
        />
      </div>
    </div>
  );
};

export default DecoratePage;
