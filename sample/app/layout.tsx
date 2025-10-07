import type { Metadata } from 'next';

import CommonLayout from '@client-common/components/layout/CommonLayout';
import { MenuItemData } from '@client-common/components/navigations/Menus/LinkMenu';

import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Common Sample",
  description: "Next.js Common Sample Application",
};

const menuItems: MenuItemData[] = [
  {
    title: 'Home',
    url: '/',
  },
  {
    title: 'CandleStick',
    url: '/sample/echarts/candle-stick',
  },
  {
    title: 'Icon',
    url: '/sample/data/icon',
  }
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CommonLayout
      title='Next.js Common Sample'
      menuItems={menuItems}
    >
      {children}
    </CommonLayout>
  );
}
