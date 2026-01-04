import CircularBackButton from "./circular-back-button";
import CircularContinueButton from "./circular-continue-button";

export default function BackContinueButtonContainer({ backText, continueText, onBack, onContinue, children, restart = false }: { backText?: string, continueText?: string, onBack?: () => void, onContinue?: () => void, children?: React.ReactNode, restart?: boolean }) {
    return (
        <div className={`w-full flex flex-row pt-0 ${!(onBack === undefined && onContinue === undefined) ? "justify-between" : "justify-center"} items-center px-52 py-4`}>
            {!(onBack === undefined && onContinue === undefined) && <CircularBackButton text={backText} onClick={onBack} />}
                {children}
            {!(onBack === undefined && onContinue === undefined) &&<CircularContinueButton text={continueText} onClick={onContinue} restart={restart} />}
        </div>
    )
}