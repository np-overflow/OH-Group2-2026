import CircularBackButton from "./circular-back-button";
import CircularContinueButton from "./circular-continue-button";

export default function BackContinueButtonContainer({ backText, continueText, onBack, onContinue, children }: { backText?: string, continueText?: string, onBack?: () => void, onContinue?: () => void, children?: React.ReactNode }) {
    return (
        <div className={`w-full flex flex-row ${!(onBack === undefined && onContinue === undefined) ? "justify-between" : "justify-center"} items-center px-32 py-4`}>
            {!(onBack === undefined && onContinue === undefined) && <CircularBackButton text={backText} onClick={onBack} />}
                {children}
            {!(onBack === undefined && onContinue === undefined) &&<CircularContinueButton text={continueText} onClick={onContinue} />}
        </div>
    )
}