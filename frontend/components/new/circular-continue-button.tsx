"use client";

import { ArrowRight, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Spinner } from "../Spinner";

export default function CircularContinueButton({ text = "Proceed", onClick, restart = false }: { text?: string, onClick?: () => void, restart?: boolean }) {
    const [loading, setLoading] = useState(false);

    return (
        <div className={`flex flex-col items-center gap-2 ${onClick && !loading ? "cursor-pointer group" : ""}`} onClick={() => {
            setLoading(true);
            onClick && onClick();
        }}>
            <div className={`p-4 size-20 ${onClick && !loading ? "bg-white border-2 border-[#2C7AFC] group-hover:bg-[#2C7AFC] transition-colors duration-300" : "bg-gray-200 border-2 border-gray-300"} rounded-full flex flex-row items-center justify-center shadow-md`}>
                {loading ? <Spinner /> : restart ? <RefreshCcw className={`size-10 ${onClick && !loading ? "text-[#2C7AFC] group-hover:text-white" : "text-gray-400"} transition-colors duration-300`} /> : <ArrowRight className={`size-10 ${onClick && !loading ? "text-[#2C7AFC] group-hover:text-white" : "text-gray-400"} transition-colors duration-300`} />}
            </div>
            <div className={`${onClick && !loading ? "bg-white text-[#2C7AFC] border border-[#2C7AFC] group-hover:bg-[#2C7AFC] group-hover:text-white" : "bg-gray-200 text-gray-400"} py-2 px-4 rounded-lg shadow-sm font-bold transition-all duration-300`}>
                <p>{text}</p>
            </div>
        </div>
    )
}