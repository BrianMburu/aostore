// components/FeatureBugChart.tsx
'use client'; // Ensure this component is a Client Component

import React from 'react';
import dynamic from 'next/dynamic';
import { StabilityData } from '@/types/analytics';
import { useTheme } from '@/context/ThemeContext';

const Plot = dynamic(() => import('react-plotly.js'), {
    ssr: false,
});

interface FeatureBugChartProps {
    data: StabilityData[];
}

const FeatureBugChart: React.FC<FeatureBugChartProps> = ({ data }) => {
    const { theme } = useTheme();
    const fontColor = theme === 'dark' ? '#ffffff' : '#000000';

    const labels = data.map(d => d.type);
    const counts = data.map(d => d.count);

    return (
        <Plot
            data={[
                {
                    type: 'pie',
                    labels: labels,
                    values: counts,
                    hole: 0.6,
                    marker: {
                        colors: ['#22c55e', '#ef4444'],
                    },
                    textinfo: 'label+percent',
                },
            ]}
            layout={{
                margin: { t: 20, r: 20, b: 20, l: 20 },
                autosize: true,
                showlegend: true,
                font: { color: fontColor },
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

export default React.memo(FeatureBugChart);
