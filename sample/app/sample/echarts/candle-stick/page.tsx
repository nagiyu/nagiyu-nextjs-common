/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import React, { useEffect, useState } from 'react';

import BasicSelect from '@client-common/components/inputs/Selects/BasicSelect';
import BasicStack from '@client-common/components/Layout/Stacks/BasicStack';
import CandleStick, { CandleStickData } from '@client-common/components/echarts/CandleStick';

export default function EChartsCandleStickSamplePage() {
    const [data, setData] = useState<CandleStickData[]>([]);
    const [dataCount, setDataCount] = useState(10);

    const generateData = (): CandleStickData[] => {
        const newData: CandleStickData[] = [];

        for (let i = 0; i < dataCount; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const open = Math.round(Math.random() * 100);
            const close = Math.round(Math.random() * 100);
            const low = Math.min(open, close) - Math.round(Math.random() * 20);
            const high = Math.max(open, close) + Math.round(Math.random() * 20);
            newData.push({
                date: date.toISOString().split('T')[0],
                data: [open, close, low, high],
            });
        }

        return newData;
    };

    useEffect(() => {
        setData(generateData());
    }, [dataCount]);

    return (
        <BasicStack>
            <CandleStick data={data} />
            <BasicSelect
                label='Sample Select'
                options={[
                    { label: '10', value: '10' },
                    { label: '30', value: '30' },
                    { label: '50', value: '50' },
                ]}
                value={dataCount.toString()}
                onChange={(value) => setDataCount(Number(value))}
            />
        </BasicStack>
    );
}
