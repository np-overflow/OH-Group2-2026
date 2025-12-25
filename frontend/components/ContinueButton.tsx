import React from "react";

interface ContinueButtonProps {
  title: string;
  isAvailable: boolean;
  onClick: () => void;
}

const ContinueButton = ({
  title,
  isAvailable,
  onClick,
}: ContinueButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-6 font-normal text-xl rounded-[4px] absolute right-20 bottom-10  ${
        isAvailable
          ? "text-white bg-[#2C7AFC] font-semibold hover:cursor-pointer hover:scale-104"
          : "text-[#616161] bg-[#A1A1A1] pointer-events-none"
      }`}
    >
      {title}
    </button>
  );
};

export default ContinueButton;
