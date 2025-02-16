// app/settings/page.tsx
'use client';
import { useRouter } from 'next/navigation'; // For Next.js 13+ with the App Router
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';

interface SettingsForm {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    notifications: boolean;
    analytics: boolean;
}

const settingsSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'),
    notifications: z.boolean(),
    analytics: z.boolean()
});

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SettingsForm>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            theme: theme,
            accentColor: '#4f46e5',
            notifications: true,
            analytics: true
        }
    });

    const onSubmit = (data: SettingsForm) => {
        setTheme(data.theme);
        toast.success("Settings updated successfully!");
    };
    const router = useRouter();

    return (
        <div>
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-indigo-600 dark:text-indigo-400"
                    >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to previous page
                    </button>
                </div>
            </header>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.form
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                >
                    {/* Theme Section */}
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Appearance
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Theme
                                </label>
                                <select
                                    {...register('theme')}
                                    className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="system">System Default</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                                    Accent Color
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        {...register('accentColor')}
                                        className="w-12 h-12 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        {...register('accentColor')}
                                        className="flex-1 p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    />
                                </div>
                                {errors.accentColor && (
                                    <p className="text-red-500 text-sm mt-1">{errors.accentColor.message}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Notification Settings */}
                    <motion.div
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
                    >
                        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Notifications
                        </h3>

                        <div className="space-y-4">
                            <label className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                <input
                                    type="checkbox"
                                    {...register('notifications')}
                                    className="w-5 h-5 rounded border-gray-300"
                                />
                                <span className="text-sm">Enable notifications</span>
                            </label>
                        </div>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-end"
                    >
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Save Changes
                        </button>
                    </motion.div>
                </motion.form>
            </div>
        </div>

    );
}