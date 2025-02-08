// components/Footer.tsx
import Link from 'next/link';
import { TwitterIcon, GithubIcon } from '@/app/ui/SocialIcons';

const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: TwitterIcon },
    { name: 'GitHub', href: 'https://github.com', icon: GithubIcon },
];

export default function Footer() {
    return (
        <footer className="border-t bg-white dark:bg-gray-800 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex space-x-6">
                        <Link
                            href="/terms"
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            Privacy Policy
                        </Link>
                    </div>

                    <div className="mt-4 md:mt-0 flex space-x-6">
                        {socialLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6 w-6" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Optional Copyright */}
                {/*
    <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      &copy; {new Date().getFullYear()} AOStore. All rights reserved.
    </p>
    */}
            </div>
        </footer>

    );
}