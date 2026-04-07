'use client';

import { useTranslation } from 'react-i18next';
import { StatCards } from './_components/stat-cards';
import { RecentOrders } from './_components/recent-orders';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('dashboard.title')}</h1>
      <StatCards />
      <RecentOrders />
    </div>
  );
}
