import { FeatureRequest, BugReport } from "@/types/dapp";
import { AppData, ProjectType, projectTypes } from '@/types/dapp'
import { Review, Reply } from "@/types/review";
import { Message, MessageType } from '@/types/message';

import { v4 as uuidv4 } from 'uuid'
/**
 * Generates an array of appIds of specified length
 */
function generateDAppIds(n: number): string[] {
    const appIds = Array.from({ length: n }, (_, i) => `TX${i}`);
    return appIds
}

export const DAPPIDS = generateDAppIds(100);


/**
 * Utility class to generate realistic dummy review data
 * Includes methods for creating reviews with varying characteristics
 * and natural-looking engagement patterns
 */
export class ReviewDataGenerator {
    private readonly usernames = [
        'CryptoEnthusiast', 'BlockchainDev', 'Web3Builder',
        'DAppExplorer', 'TokenTrader', 'NFTCollector',
        'MetaverseUser', 'ChainMaster', 'DefiWizard'
    ];

    private readonly reviewTemplates = [
        {
            positive: [
                "Really impressed with the intuitive interface. The transaction processing is lightning fast!",
                "One of the best DApps I've used. The security features are top-notch and the UI is clean.",
                "Outstanding performance and reliability. The team's responsiveness to feedback is excellent.",
                "This is a game-changer for decentralized applications. Highly recommend giving it a try.",
            ],
            neutral: [
                "Decent platform with room for improvement. The core features work well but some extras would be nice.",
                "Works as advertised, though the learning curve is a bit steep for newcomers.",
                "Good functionality but the UI could use some polishing. Still worth checking out.",
            ],
            negative: [
                "Experiencing some issues with connection stability. Hope the team addresses this soon.",
                "Basic features work okay but advanced functions need improvement.",
                "The concept is promising but the execution needs work. Looking forward to updates.",
            ]
        }
    ];

    private readonly replyTemplates = [
        "Thanks for your feedback! We're working on improving this.",
        "Appreciate your insights. Have you tried the latest update?",
        "We've noted your concerns and are addressing them.",
        "Thank you for the kind words! More features coming soon.",
    ];

    /**
     * Generates a realistic timestamp within the last 30 days
     */
    private generateTimestamp(): number {
        const now = Date.now();
        const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
        return thirtyDaysAgo + Math.random() * (now - thirtyDaysAgo);
    }

    /**
     * Creates a single reply with realistic engagement metrics
     */
    private generateReply(): Reply {
        return {
            replyId: `reply-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            comment: this.replyTemplates[Math.floor(Math.random() * this.replyTemplates.length)],
            timestamp: this.generateTimestamp(),
            upvotes: Math.floor(Math.random() * 10),
            downvotes: Math.floor(Math.random() * 3),
            user: `user-${Math.random().toString(36).substr(2, 9)}`,
            username: this.usernames[Math.floor(Math.random() * this.usernames.length)],
            profileUrl: `https://picsum.photos/20${Math.ceil(Math.random() * 10)}`
        };
    }

    /**
     * Creates a single review with natural rating distribution and engagement metrics
     */
    private generateReview(i: number = 0): Review {
        // Generate a weighted random rating (favoring 4-5 stars)
        const ratingDistribution = [1, 2, 3, 3, 4, 4, 4, 5, 5, 5];
        const rating = ratingDistribution[Math.floor(Math.random() * ratingDistribution.length)];

        // Select appropriate comment template based on rating
        let commentPool;
        if (rating >= 4) {
            commentPool = this.reviewTemplates[0].positive;
        } else if (rating === 3) {
            commentPool = this.reviewTemplates[0].neutral;
        } else {
            commentPool = this.reviewTemplates[0].negative;
        }

        // Generate engagement metrics based on rating
        const baseUpvotes = Math.floor(Math.random() * 50);
        const upvotes = rating >= 4 ? baseUpvotes * 2 : baseUpvotes;
        const downvotes = rating <= 2 ? baseUpvotes : Math.floor(baseUpvotes * 0.2);

        return {
            appId: DAPPIDS[i],
            reviewId: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            username: this.usernames[Math.floor(Math.random() * this.usernames.length)],
            comment: commentPool[Math.floor(Math.random() * commentPool.length)],
            rating,
            timestamp: this.generateTimestamp(),
            upvotes,
            downvotes,
            helpfulVotes: Math.floor(Math.random() * 20),
            unhelpfulVotes: Math.floor(Math.random() * 5),
            profileUrl: `https://picsum.photos/20${Math.ceil(Math.random() * 10)}`,
            voters: {},
            replies: Array(Math.floor(Math.random() * 3))
                .fill(null)
                .map(() => this.generateReply())
        };
    }

    /**
     * Generates an array of dummy reviews with natural distribution and engagement patterns
     * @param count Number of reviews to generate
     * @returns Array of Review objects
     */
    generateReviews(count: number): Review[] {
        const reviews: Review[] = [];

        for (let i = 0; i < count; i++) {
            reviews.push(this.generateReview(i));
        }

        // Sort by timestamp descending (newest first)
        const sortedReviews = reviews.sort((a, b) => b.timestamp - a.timestamp);
        return sortedReviews
    }

    // generateDappReviews(count: number): Record<string, Review[]> {
    //     const reviews = Object.assign({ length: count }, (_: number, i: number) => { DAPPIDS[i]=generateReviews(20, i) })
    //     return reviews
    // }

    /**
     * Generates a single review with specific rating and characteristics
     * Useful for testing specific scenarios
     */
    generateReviewWithRating(rating: number): Review {
        const review = this.generateReview();
        review.rating = rating;

        // Adjust engagement metrics based on rating
        if (rating >= 4) {
            review.upvotes = 30 + Math.floor(Math.random() * 20);
            review.downvotes = Math.floor(Math.random() * 5);
            review.comment = this.reviewTemplates[0].positive[
                Math.floor(Math.random() * this.reviewTemplates[0].positive.length)
            ];
        } else if (rating === 3) {
            review.upvotes = 10 + Math.floor(Math.random() * 20);
            review.downvotes = 5 + Math.floor(Math.random() * 5);
            review.comment = this.reviewTemplates[0].neutral[
                Math.floor(Math.random() * this.reviewTemplates[0].neutral.length)
            ];
        } else {
            review.upvotes = Math.floor(Math.random() * 10);
            review.downvotes = 10 + Math.floor(Math.random() * 10);
            review.comment = this.reviewTemplates[0].negative[
                Math.floor(Math.random() * this.reviewTemplates[0].negative.length)
            ];
        }

        return review;
    }
}

// Sample data pools to generate realistic-looking content
const featureTitlePrefixes = [
    'Add ability to',
    'Implement',
    'Introduce',
    'Enable',
    'Support for',
    'New feature:'
]

const featureVerbs = [
    'export',
    'import',
    'customize',
    'filter',
    'sort',
    'share',
    'analyze',
    'manage',
    'organize',
    'sync'
]

const featureObjects = [
    'dashboard settings',
    'user preferences',
    'data visualization',
    'report templates',
    'team collaboration features',
    'notification settings',
    'authentication methods',
    'keyboard shortcuts',
    'dark mode options',
    'backup configurations'
]

const bugTitlePrefixes = [
    'Bug:',
    'Issue:',
    'Error when',
    'Problem with',
    'Crash on',
    'Failed to'
]

const bugScenarios = [
    'loading dashboard',
    'saving changes',
    'updating profile',
    'submitting form',
    'processing data',
    'connecting to server',
    'rendering charts',
    'authenticating user',
    'exporting results',
    'applying filters'
]

/**
 * Generates an array of dummy feature requests and bug reports for testing
 * @param count - Number of items to generate
 * @param ratio - Ratio of feature requests to bug reports (0-1, default 0.6)
 * @returns Array of mixed FeatureRequest and BugReport objects
 */
export function generateTestData(count: number, ratio: number = 0.6): (FeatureRequest | BugReport)[] {
    const items: (FeatureRequest | BugReport)[] = []

    for (let i = 0; i < count; i++) {
        // Determine if this item should be a feature request based on the ratio
        const isFeature = Math.random() < ratio

        if (isFeature) {
            items.push(generateFeatureRequest())
        } else {
            items.push(generateBugReport())
        }
    }

    // Sort by timestamp in descending order (newest first)
    return items.sort((a, b) => b.timestamp - a.timestamp)
}

/**
 * Generates a single random feature request
 */
function generateFeatureRequest(): FeatureRequest {
    const prefix = featureTitlePrefixes[Math.floor(Math.random() * featureTitlePrefixes.length)]
    const verb = featureVerbs[Math.floor(Math.random() * featureVerbs.length)]
    const object = featureObjects[Math.floor(Math.random() * featureObjects.length)]

    return {
        id: uuidv4(),
        type: 'feature',
        title: `${prefix} ${verb} ${object}`,
        description: generateFeatureDescription(verb, object),
        votes: Math.floor(Math.random() * 100),
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
        userId: `user_${Math.floor(Math.random() * 1000)}`
    }
}

/**
 * Generates a single random bug report
 */
function generateBugReport(): BugReport {
    const prefix = bugTitlePrefixes[Math.floor(Math.random() * bugTitlePrefixes.length)]
    const scenario = bugScenarios[Math.floor(Math.random() * bugScenarios.length)]

    const statuses: Array<BugReport['status']> = ['open', 'in-progress', 'resolved']
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]

    return {
        id: uuidv4(),
        type: 'bug',
        title: `${prefix} ${scenario}`,
        description: generateBugDescription(scenario),
        status: randomStatus,
        timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
        userId: `user_${Math.floor(Math.random() * 1000)}`
    }
}

/**
 * Generates a detailed feature request description
 */
function generateFeatureDescription(verb: string, object: string): string {
    const benefits = [
        'improve workflow efficiency',
        'enhance user experience',
        'streamline operations',
        'increase productivity',
        'provide better insights'
    ]
    const randomBenefit = benefits[Math.floor(Math.random() * benefits.length)]

    return `As a user, I would like to be able to ${verb} ${object} in order to ${randomBenefit}. ` +
        `This would make it easier to manage my daily tasks and improve overall productivity. ` +
        `Implementation of this feature would greatly enhance the usability of the application.`
}

/**
 * Generates a detailed bug report description
 */
function generateBugDescription(scenario: string): string {
    const impacts = [
        'prevents me from completing my work',
        'causes data loss',
        'significantly slows down the application',
        'creates inconsistent results',
        'breaks the user interface'
    ]
    const randomImpact = impacts[Math.floor(Math.random() * impacts.length)]

    return `When attempting to perform ${scenario}, the application encounters an error that ${randomImpact}. ` +
        `This issue occurs consistently and requires a page refresh to resolve. ` +
        `Steps to reproduce:\n1. Navigate to the relevant page\n2. Attempt ${scenario}\n3. Observe the error`
}

/**
 * Sample Usage
 * // Generate 10 items with default ratio (60% features, 40% bugs)
 * const testData = generateTestData(10);
 * // Generate 20 items with 80% features, 20% bugs
 * const moreFeatures = generateTestData(20, 0.8);
 */



/* DAPPS */
// const getRandomNumber = (min:number, max: number) => {
//     return Math.random() * (max - min) + min
//   }

// Data pools for generating realistic content
const companyNamePrefixes = [
    'Meta', 'Crypto', 'Block', 'Chain', 'Web3', 'Digi', 'Tech', 'Quantum', 'Cyber', 'Nova'
]

const companyNameSuffixes = [
    'Labs', 'Protocol', 'Network', 'Systems', 'Solutions', 'Technologies', 'Platform', 'DAO', 'Ventures', 'Core'
]

const appNamePrefixes = [
    'Decentralized', 'Smart', 'Crypto', 'Web3', 'Chain', 'Meta', 'DeFi', 'NFT', 'Social', 'Open'
]

const appNameSuffixes = [
    'Wallet', 'Exchange', 'Bridge', 'Hub', 'Space', 'Connect', 'Verse', 'Port', 'Link', 'Flow'
]

// Description components for realistic app descriptions
const descriptionPurposes = [
    'enables secure and transparent',
    'revolutionizes how users interact with',
    'provides a seamless interface for',
    'streamlines the process of',
    'offers an innovative approach to'
]

const descriptionFeatures = [
    'digital asset management',
    'decentralized trading',
    'smart contract deployment',
    'blockchain interaction',
    'community governance',
    'token exchanges',
    'NFT creation and trading',
    'cross-chain operations',
    'DeFi protocols',
    'Web3 social networking'
]

const descriptionBenefits = [
    'while ensuring maximum security and privacy',
    'with unprecedented speed and efficiency',
    'through an intuitive user interface',
    'using cutting-edge blockchain technology',
    'with full community ownership'
]

/**
 * Generates an array of dummy DApp data for testing purposes
 * @param count - Number of DApp entries to generate
 * @returns Array of AppData objects
 */

export function generateDAppTestData(count: number): AppData[] {
    const apps: AppData[] = []

    for (let i = 0; i < count; i++) {
        apps.push(generateSingleDApp(i))
    }

    // Sort by createdTime in descending order (newest first)
    return apps.sort((a, b) => b.createdTime - a.createdTime)
}

/**
 * Generates a single random DApp entry with realistic data
 */
function generateSingleDApp(i: number = 0): AppData {
    const companyName = generateCompanyName()
    const appName = generateAppName()
    const createdTime = Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000) // Random time in last year

    return {
        appId: DAPPIDS[i],
        appName,
        companyName,
        company: companyName, // Duplicate field as per model
        websiteUrl: `https://${appName.toLowerCase().replace(/\s+/g, '')}.io`,
        projectType: generateProjectType(),
        appIconUrl: `https://picsum.photos/2${i}1/?text=${appName[0]}`, // Placeholder icon `https://picsum.photos/20${i}`
        coverUrl: `https://picsum.photos/1200/800?text=${appName}`, // Placeholder cover
        description: generateDescription(),
        ratings: generateRating(),
        bannerUrls: generateBannerUrls(3),
        createdTime,
        updatedAt: createdTime + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Random update time after creation
        discordUrl: `https://discord.gg/${generateRandomString(8)}`,
        downvotes: generateVotes(),
        protocol: Math.random() > 0.5 ? 'aocomputer' : 'arweave',
        reviews: generateReviews(),
        twitterUrl: `https://twitter.com/${appName.toLowerCase().replace(/\s+/g, '')}`,
        upvotes: generateVotes(),
        totalRatings: Math.floor(Math.random() * 1000),
        verified: Math.random() > 0.3 ? 'verified' : 'unverified' // 70% chance of being verified
    }
}

/**
 * Generates a random company name from predefined components
 */
function generateCompanyName(): string {
    const prefix = companyNamePrefixes[Math.floor(Math.random() * companyNamePrefixes.length)]
    const suffix = companyNameSuffixes[Math.floor(Math.random() * companyNameSuffixes.length)]
    return `${prefix}${suffix}`
}

/**
 * Generates a random app name from predefined components
 */
function generateAppName(): string {
    const prefix = appNamePrefixes[Math.floor(Math.random() * appNamePrefixes.length)]
    const suffix = appNameSuffixes[Math.floor(Math.random() * appNameSuffixes.length)]
    return `${prefix}${suffix}`
}

/**
 * Generates a realistic description for the DApp
 */
function generateDescription(): string {
    const purpose = descriptionPurposes[Math.floor(Math.random() * descriptionPurposes.length)]
    const feature = descriptionFeatures[Math.floor(Math.random() * descriptionFeatures.length)]
    const benefit = descriptionBenefits[Math.floor(Math.random() * descriptionBenefits.length)]

    return `${purpose} ${feature} ${benefit}. Built with a focus on user experience and scalability, ` +
        `this platform leverages blockchain technology to deliver a robust and secure solution for the Web3 ecosystem.`
}

/**
 * Generates a random project type from the predefined list
 */
function generateProjectType(): ProjectType {
    return projectTypes[Math.floor(Math.random() * projectTypes.length)]
}

/**
 * Generates a random rating between 1 and 5
 */
function generateRating(): number {
    return Math.floor(Math.random() * 4) + 2 // Generates ratings between 2 and 5
}

/**
 * Generates dummy banner URLs
 */
function generateBannerUrls(n: number = 5): Record<string, any> {
    return {
        main: Array.from({ length: n }, (_, i) => `https://picsum.photos/1200/80${i}`)
    }
}

/**
 * Generates dummy votes data
 */
function generateVotes(): Record<string, any> {
    const votes: Record<string, any> = {}
    const numberOfVotes = Math.floor(Math.random() * 20)

    for (let i = 0; i < numberOfVotes; i++) {
        votes[`user_${generateRandomString(8)}`] = {
            timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
    }

    return votes
}

/**
 * Generates dummy reviews data
 */
function generateReviews(): Record<string, any> {
    const reviews: Record<string, any> = {}
    const numberOfReviews = Math.floor(Math.random() * 15)

    for (let i = 0; i < numberOfReviews; i++) {
        reviews[`review_${generateRandomString(8)}`] = {
            userId: `user_${generateRandomString(8)}`,
            rating: generateRating(),
            comment: "Great app! Really useful features.",
            timestamp: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        }
    }

    return reviews
}

/**
 * Generates a random string of specified length
 */
function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}



// Utility function to generate dummy messages for testing
/**
 * Generates an array of dummy messages for testing purposes
 * @param count Number of messages to generate
 * @param baseTime Optional timestamp to start from (defaults to current time)
 * @returns Array of Message objects
 */
export function generateTestMessages(count: number, baseTime: number = Date.now()): Message[] {
    // Sample data for realistic message generation
    const companies = ['Acme Corp', 'TechStart', 'DevTools Inc', 'CloudScale', 'DataFlow'];
    const apps: AppData[] = generateDAppTestData(20);

    // Templates for generating realistic content
    const updateTemplates = [
        'New version {version} is now available',
        'Important security update released',
        'System maintenance scheduled for {date}',
        'Performance improvements deployed'
    ];

    const featureTemplates = [
        'Introducing new {feature} functionality',
        'Enhanced {feature} capabilities now available',
        'New integration with {integration} added',
        'Upgraded {feature} interface launched'
    ];

    const bugTemplates = [
        'Fixed issue with {feature}',
        'Resolved {feature} performance bottleneck',
        'Patched security vulnerability in {feature}',
        'Fixed crash in {feature} module'
    ];

    const features = ['authentication', 'reporting', 'analytics', 'user management', 'notifications', 'search'];
    const integrations = ['Slack', 'Gmail', 'Teams', 'Jira', 'GitHub'];

    /**
     * Generates a random message based on the given type
     */
    function generateMessageContent(type: MessageType): string {
        const getRandomItem = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

        let template: string;
        switch (type) {
            case 'update':
                template = getRandomItem(updateTemplates);
                return template
                    .replace('{version}', `${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`)
                    .replace('{date}', new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString());
            case 'feature':
                template = getRandomItem(featureTemplates);
                return template
                    .replace('{feature}', getRandomItem(features))
                    .replace('{integration}', getRandomItem(integrations));
            case 'bug':
                template = getRandomItem(bugTemplates);
                return template.replace('{feature}', getRandomItem(features));
            default:
                return 'Generic message content';
        }
    }

    return Array.from({ length: count }, (_, index) => {
        const app: AppData = apps[index % apps.length];
        const type = ['update', 'feature', 'bug'][Math.floor(Math.random() * 3)] as MessageType;
        const timeOffset = index * Math.floor(Math.random() * 24 * 60 * 60 * 1000); // Random offset within 24 hours

        return {
            id: `msg-${Date.now()}-${index}`,
            appName: app.appName,
            appIconUrl: app.appIconUrl,
            company: companies[Math.floor(Math.random() * companies.length)],
            title: `${type.charAt(0).toUpperCase() + type.slice(1)}: ${app.appName}`,
            content: generateMessageContent(type),
            linkInfo: app.websiteUrl,
            currentTime: baseTime - timeOffset,
            updateTime: Math.random() > baseTime - timeOffset + 3600000, // 50% chance of update, 1 hour later
            read: Math.random() > 0.7, // 30% chance of being unread
            type: type
        };
    });
}