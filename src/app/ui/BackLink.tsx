import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { AnimatedButton } from "./animations/AnimatedButton";

export function BackLink({ href, value }: { href: string, value: string }) {
    return (
        <AnimatedButton>
            <Link
                href={href}
                className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                {value}
            </Link>
        </AnimatedButton>
    )
}