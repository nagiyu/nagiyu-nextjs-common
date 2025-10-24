'use client';

import React from 'react';

import FeatureGuard from '@client-common/components/authorization/FeatureGuard';
import HomePage, { HomePageButton } from '@client-common/pages/HomePage';
import { PermissionLevel } from '@common/enums/PermissionLevel';

import { SampleFeature } from '@/consts/SampleConst';

export default function Home() {
  const buttons: HomePageButton[] = [
    {
      label: 'CandleStick',
      url: '/sample/echarts/candle-stick',
    },
    {
      label: 'Icon',
      url: '/sample/data/icon',
    },
    {
      label: 'Chat',
      url: '/sample/data/chat',
    },
    {
      label: 'Alert',
      url: '/sample/feedback/alert',
    },
    {
      label: 'LinkMenu Demo',
      url: '/sample/linkmenu-demo',
    },
    {
      label: 'Identifier',
      url: '/sample/identifier',
    }
  ];

  return (
    <FeatureGuard
      feature={SampleFeature.HOME}
      level={PermissionLevel.VIEW}
    >
      <HomePage buttons={buttons} />
    </FeatureGuard>
  );
}
