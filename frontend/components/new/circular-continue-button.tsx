"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../Spinner";

export default function CircularContinueButton({ text = "Proceed", onClick }: { text?: string, onClick?: () => void }) {
    const [loading, setLoading] = useState(false);

    return (
        <div className={`flex flex-col items-center gap-2 ${onClick ? "cursor-pointer" : ""}`} onClick={() => {
            setLoading(true);
            onClick && onClick();
        }}>
            <div className={`p-4 size-20  ${onClick ? "bg-[#2C7AFC]" : "bg-gray-400"} rounded-full flex flex-row items-center justify-center`}>
                {loading ? <Spinner /> : <ArrowRight className="size-10 text-white" />}
            </div>
            <div className={`${onClick ? "bg-[#2C7AFC]" : "bg-gray-400"} text-white py-2 px-4 rounded-lg`}>
                <p className="font-bold">{text}</p>
            </div>
        </div>
    )
}