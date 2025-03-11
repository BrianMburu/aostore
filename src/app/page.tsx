'use client'

// import Link from 'next/link'
import { useRouter } from 'next/navigation'

// import { UserAcquisitionGraph } from './ui/Analytics/UserAcquisitionGraph'
// import { Suspense } from 'react'
import { HighlightCard } from './ui/Home/HighlightCard'
import { HandshakeIcon, TrendingUp } from 'lucide-react'
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/20/solid'
import { AnimatedButton } from './ui/animations/AnimatedButton'
import AnimatedBackground from './ui/Home/AnimatedBackground'

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background - placed as first child */}
      <AnimatedBackground />

      {/* Content - positioning it over the background */}
      <div className="relative z-10 space-y-20">
        {/* Hero Section */}
        <section className="py-20 bg-transparent">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 dark:text-white">
              Welcome to <span className='text-blue-500'>AoStore</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Your gateway to the best decentralized applications. Explore, interact,
              and manage Web3 experiences with unprecedented ease.
            </p>
            <div className="flex justify-center gap-4">
              <AnimatedButton
                onClick={() => router.push("/dapps")}
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Explore dApps
              </AnimatedButton>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Platform Highlights
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Your feature cards */}
            {[
              {
                title: "Verified dApps",
                desc: "Rigorous verification process ensures quality and security",
                icon: "🛡️"
              },
              {
                title: "Community Power",
                desc: "Real user reviews and ratings guide your choices",
                icon: "🌟"
              },
              {
                title: "Seamless Management",
                desc: "Complete toolkit for dApp developers and users",
                icon: "🧰"
              },
              {
                title: "Build Reputation",
                desc: "Earn AOS tokens and points for your contributions. Build your reputation across the ecosystem.",
                icon: <TrendingUp size={45} className='text-cyan-500' />,
              },
              {
                title: "Communication Channel",
                desc: "Projects can communicate directly with users. Share feedback, bug reports, or feature requests.",
                icon: <ChatBubbleBottomCenterTextIcon className='w-12 h-12 text-gray-600' />,
              },
              {
                title: "Collaboration Layer",
                desc: "Participate in airdrops and ecosystem tasks. Collaborate with projects and other users.",
                icon: <HandshakeIcon size={45} className='w-12 h-12 text-gray-700 dark:text-white' />,
              },
            ].map((feature, i) => (
              <HighlightCard key={i} value={feature.desc} {...feature} />
            ))}
          </div>
        </section>

        {/* Problem/Solution Grid - with modified background classes */}
        <section className="container mx-auto py-5">
          <h1 className="text-4xl font-bold mb-6 dark:text-white text-center">
            Playstore for Arweave and Aocomputer Ecosystem.
          </h1>
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">
            <div className="bg-red-50/80 dark:bg-red-900/30 backdrop-blur-sm p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 dark:text-white">
                The Challenge
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                With over 5,000 dApps across 50+ chains, users face:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                {[
                  "Fragmented discovery experience",
                  "Security concerns",
                  "Lack of unified management",
                  "Limited community governance"
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/80 dark:bg-indigo-900/30 backdrop-blur-sm p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4 dark:text-white">
                Our Solution
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                A comprehensive platform offering:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                {[
                  "Cross-chain dApp directory",
                  "Verified project listings",
                  "Community governance tools",
                  "Unified analytics dashboard"
                ].map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        {/* <section className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold dark:text-white">
                Why Build With Us?
              </h2>
              <ul className="space-y-4">
                {[
                  "Easy to use and intuitive platform",
                  "Real-time analytics dashboard",
                  "Easy dApp submission process",
                  "Secure wallet integrations",
                  "Developer-friendly airdrop tools",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Suspense fallback={<div>Loading...</div>}>
              <UserAcquisitionGraph title='AOStore Users' />
            </Suspense>
          </div>
        </div>
      </section> */}
      </div>
    </div>
  )
}