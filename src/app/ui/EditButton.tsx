import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { AnimatedButton } from "./animations/AnimatedButton";

export function EditButton({ onClick, toolTip }: { toolTip: string, onClick: () => void }) {
    return (
        <AnimatedButton onClick={onClick} className="relative group text-gray-500 dark:text-white hover:text-blue-600 hover:dark:text-blue-300">
            <PencilSquareIcon className="h-5 w-5" />
            <span className="absolute border bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2">
                {toolTip}
            </span>
        </AnimatedButton>
    )
}