'use client'

import { checkValidUrl } from "@/utils/airdrops";
import Image from "next/image";
import { useState } from "react";

export default function ProfileImage({
    imgUrl,
    alt,
    className
}: {
    imgUrl: string;
    alt: string;
    className: string;
}) {
    const [hasError, setHasError] = useState(false);
    const displayFallback = !checkValidUrl(imgUrl) || hasError;
    const fallbackText = alt?.slice(0, 1) || 'U';

    return (
        <div className={`relative ${className}`}>
            {!displayFallback ? (
                <Image
                    src={imgUrl}
                    alt={alt}
                    height={40}
                    width={40}
                    className={`rounded-full object-cover ${className}`}
                    onError={() => setHasError(true)}
                />
            ) : (
                <div
                    className={`flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 font-medium text-gray-600 dark:text-gray-300 ${className}`}
                >
                    {fallbackText.toUpperCase()}
                </div>
            )}
        </div>
    );
}