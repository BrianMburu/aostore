import { motion } from 'framer-motion';
import {
    DocumentMagnifyingGlassIcon,
    InboxIcon,
    BellAlertIcon,
    PlusCircleIcon,
    QuestionMarkCircleIcon,
    ArrowTopRightOnSquareIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    TrashIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string | React.ReactNode;
    icon?: 'search' | 'inbox' | 'alert' | 'add' | React.ComponentType<{ className?: string }>;
    actionIcon?: 'refresh' | 'edit' | 'delete' | React.ComponentType<{ className?: string }>;
    illustration?: React.ComponentType<{ className?: string }>;
    action?: {
        label: string;
        href?: string;
        onClick?: () => void;
    };
    progress?: number;
    interactive?: boolean;
    helpLink?: string;
    loading?: boolean;
    className?: string;
}

export function EmptyState({
    title,
    description,
    icon,
    actionIcon,
    illustration: Illustration,
    action,
    progress,
    interactive,
    helpLink,
    loading,
    className
}: EmptyStateProps) {
    const [progressWidth, setProgressWidth] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (typeof progress === 'number') {
            const timeout = setTimeout(() => {
                setProgressWidth(Math.min(Math.max(progress, 0), 100));
            }, 100);
            return () => clearTimeout(timeout);
        }
    }, [progress]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function isValidComponent(Component: any): boolean {
        return (
            typeof Component === 'function' ||
            (typeof Component === 'object' && Component !== null && Component.$$typeof != null)
        );
    }


    const IconComponent = () => {
        if (Illustration) return <Illustration className="h-40 w-40" />;
        if (icon && isValidComponent(icon)) {
            return React.createElement(icon, { className: "h-16 w-16" });
        }

        switch (icon) {
            case 'inbox': return <InboxIcon className="h-16 w-16" />;
            case 'alert': return <BellAlertIcon className="h-16 w-16" />;
            case 'add': return <PlusCircleIcon className="h-16 w-16" />;
            case 'search':
            default: return <DocumentMagnifyingGlassIcon className="h-16 w-16" />;
        }
    };

    const ActionIconComponent = () => {
        if (typeof actionIcon === 'function') return React.createElement(actionIcon, { className: "h-5 w-5 mr-2" });
        switch (actionIcon) {
            case 'refresh':
                return <ArrowPathIcon className="h-5 w-5 mr-2" />;
            case 'edit':
                return <PencilSquareIcon className="h-5 w-5 mr-2" />;
            case 'delete':
                return <TrashIcon className="h-5 w-5 mr-2" />;
            default:
                return <PlusCircleIcon className="h-5 w-5 mr-2" />;
        }
    };

    if (loading) {
        return (
            <div className={`animate-pulse p-8 rounded-xl bg-gray-50 dark:bg-gray-800 ${className}`}>
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-10 w-36 rounded bg-gray-200 dark:bg-gray-700 mt-4" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onHoverStart={() => interactive && setIsHovered(true)}
            onHoverEnd={() => interactive && setIsHovered(false)}
            className={`group relative flex flex-col items-center justify-center text-center p-8 rounded-xl bg-white dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-auto ${className}`}
        >
            {/* Interactive Background Effect */}
            {interactive && (
                <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-50/50 to-cyan-50/50 dark:from-indigo-900/20 dark:to-cyan-900/20 opacity-0 group-hover:opacity-100"
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* Floating Icon/Illustration */}
            <motion.div
                animate={{
                    scale: isHovered ? 1.05 : 1,
                    y: isHovered ? -5 : 0
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mb-6 text-gray-400 dark:text-gray-500 relative"
            >
                <IconComponent />

                {/* Progress Indicator */}
                {typeof progress === 'number' && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                        <motion.div
                            className="bg-indigo-600 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressWidth}%` }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                        />
                    </div>
                )}
            </motion.div>

            <div className="space-y-4 relative z-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {title}
                </h3>

                <div className="text-gray-600 dark:text-gray-400 max-w-md mx-auto space-y-2">
                    {description}

                    {helpLink && (
                        <Link
                            href={helpLink}
                            className="inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-2"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Learn more
                            <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                        </Link>
                    )}
                </div>

                {action && (
                    <div className="mt-6">
                        {action.href ? (
                            <Link
                                href={action.href}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                <ActionIconComponent />
                                {action.label}
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={action.onClick}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors shadow-sm hover:shadow-md"
                            >
                                <ActionIconComponent />
                                {action.label}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Contextual Help */}
            {helpLink && (
                <Link
                    href={helpLink}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    title="Get help"
                >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                </Link>
            )}
        </motion.div>
    );
}

// Skeleton Loader Component
EmptyState.Skeleton = function EmptyStateSkeleton({ className }: { className?: string }) {
    return (
        <div className={`animate-pulse p-8 rounded-xl bg-gray-50 dark:bg-gray-800 ${className}`}>
            <div className="flex flex-col items-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-48 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-10 w-36 rounded bg-gray-200 dark:bg-gray-700 mt-4" />
            </div>
        </div>
    );
};

// Progress Indicator Component
EmptyState.Progress = function ProgressIndicator({ value }: { value: number }) {
    return (
        <div className="w-32 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
            />
        </div>
    );
};