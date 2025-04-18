import { cn } from '@/utils/classNames';
import Image, { ImageProps } from 'next/image';
import * as React from 'react';

/**
 * @description Image component that uses Next.js Image component with skeleton loading and blur effect
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 * @param classNames custom class names for image and blur
 * @param alt alt text for the image
 * @param width width of the image
 * @param height height of the image
 * @param layout layout of the image (fill or fixed)
 */
type NextImageProps = {
    useSkeleton?: boolean;
    classNames?: {
        image?: string;
        blur?: string;
    };
    alt: string;
} & (
        | { width: string | number; height: string | number }
        | { layout: 'fill'; width?: string | number; height?: string | number }
    ) &
    ImageProps;

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export default function NextImage({
    useSkeleton = false,
    src,
    width,
    height,
    alt,
    className,
    classNames,
    ...rest
}: NextImageProps) {
    const [status, setStatus] = React.useState(
        useSkeleton ? 'loading' : 'complete'
    );
    const widthIsSet = className?.includes('w-') ?? false;

    return (
        <figure
            style={!widthIsSet ? { width: `${width}px` } : undefined}
            className={className}
        >
            <Image
                className={cn(
                    classNames?.image,
                    status === 'loading' && cn('animate-pulse', classNames?.blur)
                )}
                src={src}
                width={width}
                height={height}
                alt={alt}
                onLoadingComplete={() => setStatus('complete')}
                {...rest}
            />
        </figure>
    );
}
