"use client";

import ContinueButton from "@/components/ContinueButton";
import DraggableSticker from "@/components/DraggableSticker";
import StickerButton from "@/components/StickerButton";
import React, { useEffect, useRef, useState } from "react";

const DecoratePage = () => {
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
  const [stickerCount, setStickerCount] = useState<Record<number, StickerData>>(
    {}
  );

  useEffect(() => {
    const photostripImage = new Image();
    photostripImage.src = "/images/blank-photostrip.png";
    photostripImage.onload = () => {
      if (canvas.current) {
        let ctx = canvas.current.getContext("2d");
        ctx?.drawImage(photostripImage, 0, 0, 900, 2700);
      }
    };
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
    if (canvas.current && testLink.current) {
      pngDataURL = canvas.current.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas to blob conversion failed.")
          return;
        }
        testLink.current!.href = URL.createObjectURL(blob);
        testLink.current!.download = "babygurl";
        console.log(testLink.current!.href);
      });
    }
  }

  return (
    <div className="p-8 h-screen relative">
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
          <h3 className="text-2xl font-semibold text-center mb-4">Stickers</h3>
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
      <a ref={testLink} href="#">
        yo
      </a>
    </div>
  );
};

export default DecoratePage;
