import React from 'react'

interface StickerButtonProps {
    stickerSrc:string,
    onClick: () => void;
}

const StickerButton = ({stickerSrc, onClick}:StickerButtonProps) => {
  return (
    <button onClick={onClick} className="p-2 full bg-[#9cbaee] rounded-xl aspect-square relative hover:scale-104 cursor-pointer shadow-lg">
        <div className={`bg-center bg-contain bg-no-repeat h-full w-auto`} style={{backgroundImage: `url("${stickerSrc}")`}}></div>
    </button>
  )
}

export default StickerButton