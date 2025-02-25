// components/LikesGrowthChart.tsx
'use client'; // Ensure this component is a Client Component

import React from 'react';
import dynamic from 'next/dynamic';
import { HourlyData } from '@/types/analytics';
import { useTheme } from '@/context/ThemeContext';

const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
});

interface LikesGrowthChartProps {
    data: HourlyData[];
}

const LikesGrowthChart: React.FC<LikesGrowthChartProps> = ({ data }) => {
    const { theme } = useTheme();
    const axisColor = theme === 'dark' ? '#ffffff' : '#000000';

    const hours = data.map(d => d.hour);
    const likes = data.map(d => d.likes);

    return (
        <Plot
            data={[
                {
                    x: hours,
                    y: likes,
                    type: 'scatter',
                    mode: 'lines+markers',
                    fill: 'tozeroy',
                    line: { color: '#059669' },
                    marker: { color: '#059669' },
                },
            ]}
            layout={{
                margin: { t: 20, r: 20, b: 40, l: 60 },
                xaxis: {
                    title: 'Hour',
                    dtick: 1,
                    tickfont: { color: axisColor },
                    titlefont: { color: axisColor },
                    showgrid: false,
                },
                yaxis: {
                    title: 'Likes',
                    tickfont: { color: axisColor },
                    titlefont: { color: axisColor },
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

export default React.memo(LikesGrowthChart);
