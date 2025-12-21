"use client";

import ContinueButton from "@/components/ContinueButton";
import MenuButton from "@/components/MenuButton";
import { useState } from "react";

export default function HomePage() {
  const [selected, setSelected] = useState(1);
  const [available, setAvailable] = useState(false);

  return (
    <div className=" p-8 h-screen relative flex items-center justify-center">
      <div className="p-8  flex flex-col items-center font-geist gap-4 bg-radial from-[#7E83D3] to-[#F9F9FF] to-50%">
        <h1 className="text-4xl font-bold">Choose Option</h1>
        <img
          src={
            selected === 1 ? "/images/regularbg.png" : "/images/custombg.png"
          }
          className="max-h-120"
        ></img>
        <div className=" flex gap-20">
          <MenuButton
            title="Normal background"
            isSelected={selected === 1 ? true : false}
            onClick={() => {
              setSelected(1);
              setAvailable(true);
            }}
          ></MenuButton>
          <MenuButton
            title="Upload background"
            isSelected={selected === 2 ? true : false}
            onClick={() => {
              setSelected(2);
              setAvailable(true);
            }}
          ></MenuButton>
        </div>
      </div>
      <ContinueButton onClick={() => {}} title="Continue" isAvailable={true} />
    </div>
  );
}
