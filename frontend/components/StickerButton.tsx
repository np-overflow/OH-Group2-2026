import React from 'react'

interface StickerButtonProps {
  stickerSrc: string,
  onClick: () => void;
}

const StickerButton = ({ stickerSrc, onClick }: StickerButtonProps) => {
  return (
    <button onClick={onClick} className="p-2 full bg-white rounded-xl aspect-square relative hover:scale-105 cursor-pointer shadow-md border-2 border-neon-blue/20 hover:border-neon-blue/80 transition-all duration-300">
      <div className={`bg-center bg-contain bg-no-repeat h-full w-auto`} style={{ backgroundImage: `url("${stickerSrc}")` }}></div>
    </button>
  )
}

export default StickerButton