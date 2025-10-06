import React, { useEffect, useState } from 'react';

import ReactECharts from 'echarts-for-react';

export interface CandleStickData {
    date: string;
    data: [number, number, number, number];
}

type CandleStickProps = {
    data: CandleStickData[];
    scrollable?: boolean;
    className?: string;
}

function getOption(data: CandleStickData[], isMobile: boolean, scrollable: boolean) {
    // Calculate minimum width per candle to maintain readability
    const minCandleWidth = isMobile ? 20 : 30;
    const chartWidth = scrollable ? data.length * minCandleWidth : undefined;

    return {
        grid: {
            left: isMobile ? '15%' : '10%',
            right: isMobile ? '15%' : '10%',
            bottom: isMobile ? '15%' : '10%',
            top: '10%',
            width: chartWidth
        },
        xAxis: {
            data: data.map(item => item.date),
            axisLabel: {
                rotate: isMobile ? 45 : 0,
                fontSize: isMobile ? 10 : 12,
                interval: 0
            }
        },
        yAxis: {
            scale: true,
            axisLabel: {
                fontSize: isMobile ? 10 : 12
            }
        },
        series: [
            {
                type: 'candlestick',
                data: data.map(item => item.data),
                barWidth: isMobile ? 10 : 15
            }
        ],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        }
    }
}

export default function CandleStick({ data, scrollable = false, className = '' }: CandleStickProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const minCandleWidth = isMobile ? 20 : 30;
    const chartWidth = scrollable ? data.length * minCandleWidth : undefined;

    if (scrollable) {
        return (
            <div 
                className={className} 
                style={{ 
                    overflowX: 'auto', 
                    overflowY: 'hidden',
                    width: '100%',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div style={{ width: chartWidth ? `${chartWidth}px` : '100%', minWidth: '100%' }}>
                    <ReactECharts 
                        option={getOption(data, isMobile, scrollable)}
                        style={{ height: '400px', width: '100%' }}
                    />
                </div>
            </div>
        );
    }

    return (
        <ReactECharts 
            option={getOption(data, isMobile, scrollable)}
            style={{ height: '400px', width: '100%' }}
        />
    );
}
