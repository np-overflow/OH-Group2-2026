import { ArrowLeft } from "lucide-react";

export default function CircularBackButton({text = "Back", onClick }: { text?: string, onClick?: () => void }) {
    return (
        <div className={`flex flex-col items-center gap-2 ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
            <div className={`p-4 size-20  ${onClick ? "bg-[#2C7AFC]" : "bg-gray-400"} rounded-full flex flex-row items-center justify-center`}>
                <ArrowLeft className="size-10 text-white" />
            </div>
            <div className={`${onClick ? "bg-[#2C7AFC]" : "bg-gray-400"} text-white py-2 px-4 rounded-lg`}>
                <p className="font-bold">{text}</p>
            </div>
        </div>
    )
}