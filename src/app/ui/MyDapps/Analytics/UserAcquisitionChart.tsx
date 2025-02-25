// components/UserAcquisitionChart.tsx
'use client'; // Ensure this component is a Client Component

import React from 'react';
import dynamic from 'next/dynamic';
import { DailyData } from '@/types/analytics';
import { useTheme } from '@/context/ThemeContext';

const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
});

interface UserAcquisitionChartProps {
    data: DailyData[];
}

const UserAcquisitionChart: React.FC<UserAcquisitionChartProps> = ({ data }) => {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#ffffff' : '#000000';

    const dates = data.map(d => d.date);
    const favorites = data.map(d => d.favorites);

    return (
        <Plot
            data={[
                {
                    type: 'bar',
                    x: dates,
                    y: favorites,
                    marker: { color: '#818cf8' },
                },
            ]}
            layout={{
                margin: { t: 20, r: 20, b: 80, l: 60 },
                xaxis: { tickangle: -45, tickfont: { color: axisColor } },
                yaxis: {
                    title: 'Favorites',
                    titlefont: { color: axisColor },
                    tickfont: { color: axisColor }
                },
                autosize: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
            }}
            config={{
                displaylogo: false, // Remove Plotly logo
            }}
            useResizeHandler
            style={{ width: '100%', height: '90%' }}
        />
    );
};

export default React.memo(UserAcquisitionChart);
