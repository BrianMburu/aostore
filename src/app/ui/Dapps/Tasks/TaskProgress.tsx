import clsx from "clsx"

interface ProgressProps {
    value: number
    className?: string
}

export function Progress({ value, className }: ProgressProps) {
    return (
        <div className={clsx("h-3 w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700", className)}>
            <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
            />
        </div>
    )
}