"use client";

import ContinueButton from "@/components/ContinueButton";
import MenuButton from "@/components/MenuButton";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  let router = useRouter();
  const [selected, setSelected] = useState(1);
  const [available, setAvailable] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  useEffect(() => {
    const newId = Math.random().toString(36).substring(3);
    localStorage.setItem("sessionId", newId);
    setSessionId(newId);
  }, []);

  function routeAndPass(option:number) {
    if (option === 1) {
      localStorage.setItem("option", "regular")
      router.push("/adminpanel/livephoto")
    }
    else {
      localStorage.setItem("option", "custom")
      router.push("/adminpanel/upload");
    }
  }

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
      <ContinueButton
        onClick={() => {
          selected === 1
            ? routeAndPass(1)
            : routeAndPass(2)
        }}
        title="Continue"
        isAvailable={true}
      />
    </div>
  );
}
