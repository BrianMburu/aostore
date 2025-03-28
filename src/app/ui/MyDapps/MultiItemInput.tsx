import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckBadgeIcon, XMarkIcon } from '@heroicons/react/24/outline';

export interface MultiItemInputProps {
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
    inputClassName?: string;
    containerClassName?: string;
    tagClassName?: string;
    hasErrors?: boolean;
}

export function MultiItemInput({
    items,
    onChange,
    placeholder = 'Enter values separated by commas...',
    inputClassName = '',
    containerClassName = '',
    tagClassName = '',
    hasErrors = false,
}: MultiItemInputProps) {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle changes from typing; if a comma is detected at the end, add the value.
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.endsWith(',')) {
            const newItem = value.slice(0, -1).trim();
            if (newItem && !items.includes(newItem)) {
                onChange([...items, newItem]);
            }
            setInputValue('');
            return;
        }
        setInputValue(value);
    };

    // Handle paste event to split comma-separated strings.
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pastedText = e.clipboardData.getData('text');
        // Split by comma, trim each value, and filter out empty strings.
        const pastedItems = pastedText.split(',').map(item => item.trim()).filter(Boolean);
        if (pastedItems.length > 0) {
            e.preventDefault();
            // Only add items that are not already present.
            const newItems = pastedItems.filter(item => !items.includes(item));
            if (newItems.length > 0) {
                onChange([...items, ...newItems]);
            }
        }
    };

    // Remove an item from the list.
    const removeItem = (itemToRemove: string) => {
        onChange(items.filter((item) => item !== itemToRemove));
    };

    // Allow removal with Backspace when input is empty.
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && inputValue === '' && items.length > 0) {
            const lastItem = items[items.length - 1];
            removeItem(lastItem);
            setInputValue(lastItem);
        }
    };

    return (
        <div
            className={`relative ${containerClassName}`}
            onClick={() => inputRef.current?.focus()}
        >
            <div
                className={`flex flex-wrap gap-2 items-center p-3 border rounded-lg transition-colors ${hasErrors
                    ? 'border-red-500 dark:border-red-400'
                    : 'border-gray-300 dark:border-gray-600 focus-within:border-indigo-500 dark:focus-within:border-indigo-400'
                    } bg-white dark:bg-gray-800`}
            >
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div
                            key={item}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`flex items-center gap-1 px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full ${tagClassName}`}
                        >
                            <CheckBadgeIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-sm text-indigo-800 dark:text-indigo-200 truncate max-w-40">{item}</span>
                            <button
                                type="button"
                                onClick={() => removeItem(item)}
                                className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={`flex-1 min-w-[200px] p-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 ${inputClassName}`}
                />
            </div>
        </div>
    );
}
