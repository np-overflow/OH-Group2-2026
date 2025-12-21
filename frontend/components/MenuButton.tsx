import React from "react";

interface ButtonProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

const MenuButton = ({ title, isSelected, onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-50 p-4 rounded-[6px] border-2 hover:cursor-pointer hover:scale-102 ${
        isSelected
          ? "border-[#2875F4] text-[#155DE3] font-semibold"
          : "border-[#686E77] text-[#605757]"
      }`}
    >
      {title}
    </button>
  );
};

export default MenuButton;
