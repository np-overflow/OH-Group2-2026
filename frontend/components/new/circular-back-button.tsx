import { ArrowLeft } from "lucide-react";

export default function CircularBackButton({ text = "Back", onClick }: { text?: string, onClick?: () => void }) {
    return (
        <div className={`flex flex-col items-center gap-2 ${onClick ? "cursor-pointer group" : ""}`} onClick={onClick}>
            <div className={`p-4 size-20 ${onClick ? "bg-white border-2 border-[#2C7AFC] group-hover:bg-[#2C7AFC] transition-colors duration-300" : "bg-gray-200 border-2 border-gray-300"} rounded-full flex flex-row items-center justify-center shadow-md`}>
                <ArrowLeft className={`size-10 ${onClick ? "text-[#2C7AFC] group-hover:text-white transition-colors duration-300" : "text-gray-400"}`} />
            </div>
            <div className={`${onClick ? "bg-white text-[#2C7AFC] border border-[#2C7AFC] group-hover:bg-[#2C7AFC] group-hover:text-white" : "bg-gray-200 text-gray-400"} py-2 px-4 rounded-lg shadow-sm font-bold transition-all duration-300`}>
                <p>{text}</p>
            </div>
        </div>
    )
}