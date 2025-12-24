import React, { useRef, useState } from "react";

interface DraggableStickerProps {
  width: number;
  height: number;
  imgSrc: string;
  stickerId: string;
  canvasOverlay: React.RefObject<HTMLDivElement | null>;
}

const DraggableSticker = ({
  width,
  height,
  imgSrc,
  stickerId,
  canvasOverlay,
}: DraggableStickerProps) => {
  const coords = useRef({
    startX: 0,
    startY: 0,
  });

  const dragElement = useRef<HTMLImageElement>(null);
  function handleMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    if (canvasOverlay.current) {
      coords.current.startX = e.clientX - canvasOverlay.current.offsetLeft;
      coords.current.startY = e.clientY - canvasOverlay.current.offsetTop;

      window.addEventListener("mousemove", mouseMove);
      window.addEventListener("mouseup", mouseUp);
    }
  }

  // I need to set boundaries for where the newX and newY can be?
  // dragElement.current!.offsetLeft - newX !> 540px (width of photostrip)

  function mouseMove(e: any) {
    if (canvasOverlay.current) {
      let newX: number =
        coords.current.startX - (e.clientX - canvasOverlay.current.offsetLeft);
      let newY: number =
        coords.current.startY - (e.clientY - canvasOverlay.current.offsetTop);

      coords.current.startX = e.clientX - canvasOverlay.current.offsetLeft;
      coords.current.startY = e.clientY - canvasOverlay.current.offsetTop;

      /* Code for sticker not moving when mouse exits photostrip area (less responsive imo)
      let mouseX = e.clientX - canvasOverlay.current.offsetLeft;
      let mouseY = e.clientY - canvasOverlay.current.offsetTop;

      if (mouseX < 0 || mouseX > 180 || mouseY < 0 || mouseY > 540) {
        mouseUp();
        return;
      }
        */

      if (
        dragElement.current!.offsetLeft - newX <
          180 - dragElement.current!.clientWidth &&
        dragElement.current!.offsetLeft - newX > 0 &&
        dragElement.current!.offsetTop - newY > 0 &&
        dragElement.current!.offsetTop - newY <
          540 - dragElement.current!.clientHeight
      ) {
        dragElement.current!.style.left =
          dragElement.current!.offsetLeft - newX + "px";
        dragElement.current!.style.top =
          dragElement.current!.offsetTop - newY + "px";
      }
    }
  }

  function mouseUp() {
    window.removeEventListener("mousemove", mouseMove);
    window.removeEventListener("mouseup", mouseUp);
  }

  return (
    <img
      ref={dragElement}
      src={imgSrc}
      className={`w-[${width}px] h-auto max-w-[25px]  absolute ${stickerId}`}
      onMouseDown={(e) => {
        handleMouseDown(e);
      }}
    ></img>
  );
};

export default DraggableSticker;
