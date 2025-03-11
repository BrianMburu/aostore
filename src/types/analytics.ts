// Define interfaces for our data structures
export interface DailyData {
    date: string;
    favorites: number;
}

export interface HourlyData {
    hour: number;
    likes: number;
}

export interface StabilityData {
    type: 'feature' | 'bug';
    count: number;
}

export interface AnalyticsData {
    userAcquisition: DailyData[];
    popularity: HourlyData[];
    stability: StabilityData[];
}