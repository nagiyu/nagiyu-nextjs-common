'use client';

import React from 'react';

import HomePage, { HomePageButton } from '@client-common/pages/HomePage';

export default function Home() {
  const buttons: HomePageButton[] = [
    {
      label: 'CandleStick',
      url: '/sample/echarts/candle-stick',
    },
    {
      label: 'Icon',
      url: '/sample/data/icon',
    }
  ];

  return (
    <HomePage buttons={buttons} />
  );
}
