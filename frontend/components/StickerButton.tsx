import React from 'react'

interface StickerButtonProps {
    stickerSrc:string,
    onClick: () => void;
}

const StickerButton = ({stickerSrc, onClick}:StickerButtonProps) => {
  return (
    <button onClick={onClick} className="p-2 full bg-[#2C7AFC] rounded aspect-square relative hover:scale-104 cursor-pointer">
        <div className={`bg-center bg-contain bg-no-repeat h-full w-auto`} style={{backgroundImage: `url("${stickerSrc}")`}}></div>
    </button>
  )
}

export default StickerButton