"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../Spinner";

export default function CircularContinueButton({ text = "Continue", onClick }: { text?: string, onClick?: () => void }) 
{
    const [loading, setLoading] = useState(false);

    return (
        <div className={`flex flex-col items-center gap-2 ${onClick ? "cursor-pointer" : ""}`} onClick={() => {
            setLoading(true);
            onClick && onClick();
        }}>
            <div className={`p-4 size-20  ${onClick ? "bg-[#2C7AFC]" : "bg-gray-400"} rounded-full flex flex-row items-center justify-center`}>
                {loading ? <Spinner /> : <ArrowRight className="size-10 text-white" />}
            </div>
            <p className="text-lg font-bold">{text}</p>
        </div>
    )
}