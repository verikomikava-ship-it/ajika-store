'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, ShoppingCart, DollarSign, Package, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockStats } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format-price';
import { supabase, isMockMode } from '@/lib/supabase';

interface Stats {
  total_users: number;
  total_orders: number;
  total_revenue: number;
  total_products: number;
  pending_orders: number;
  low_stock_products: number;
}

export function StatCards() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>(mockStats);

  useEffect(() => {
    if (isMockMode) return;

    async function fetchStats() {
      const [usersRes, ordersRes, productsRes, pendingRes, lowStockRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('total'),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('products').select('id', { count: 'exact', head: true }).lt('stock', 5),
      ]);

      const totalRevenue = (ordersRes.data || []).reduce((sum: number, o: { total: number }) => sum + (o.total || 0), 0);

      setStats({
        total_users: usersRes.count || 0,
        total_orders: ordersRes.data?.length || 0,
        total_revenue: totalRevenue,
        total_products: productsRes.count || 0,
        pending_orders: pendingRes.count || 0,
        low_stock_products: lowStockRes.count || 0,
      });
    }

    fetchStats();
  }, []);

  const cards = [
    { title: t('dashboard.totalUsers'), value: stats.total_users.toLocaleString(), icon: Users, color: 'text-blue-500' },
    { title: t('dashboard.totalOrders'), value: stats.total_orders.toLocaleString(), icon: ShoppingCart, color: 'text-green-500' },
    { title: t('dashboard.revenue'), value: formatPrice(stats.total_revenue), icon: DollarSign, color: 'text-yellow-500' },
    { title: t('dashboard.totalProducts'), value: stats.total_products.toLocaleString(), icon: Package, color: 'text-purple-500' },
    { title: t('dashboard.pendingOrders'), value: stats.pending_orders.toLocaleString(), icon: Clock, color: 'text-orange-500' },
    { title: t('dashboard.lowStock'), value: stats.low_stock_products.toLocaleString(), icon: AlertTriangle, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            <card.icon className={`w-5 h-5 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
