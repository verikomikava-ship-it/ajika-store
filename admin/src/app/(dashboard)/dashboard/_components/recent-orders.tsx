'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOrders } from '@/lib/mock-data';
import { supabase, isMockMode } from '@/lib/supabase';
import { formatPrice } from '@/lib/format-price';
import type { Order, OrderStatus, PaymentStatus } from '@/types/order';

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  confirmed: 'secondary',
  processing: 'secondary',
  shipped: 'default',
  delivered: 'default',
  completed: 'default',
  cancelled: 'destructive',
  returned: 'destructive',
};

const paymentVariant: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline',
  paid: 'default',
  failed: 'destructive',
  refunded: 'secondary',
};

export function RecentOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentOrders() {
      if (isMockMode) {
        setOrders(mockOrders.slice(0, 10));
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false })
          .limit(10);
        if (error) throw error;
        setOrders((data as Order[]) ?? []);
      } catch (err) {
        console.error('Failed to fetch recent orders:', err);
        setOrders(mockOrders.slice(0, 10));
      } finally {
        setLoading(false);
      }
    }
    fetchRecentOrders();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t('dashboard.recentOrders')}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('orders.orderNumber')}</TableHead>
              <TableHead>{t('orders.customer')}</TableHead>
              <TableHead>{t('orders.total')}</TableHead>
              <TableHead>{t('orders.status')}</TableHead>
              <TableHead>{t('orders.paymentStatus')}</TableHead>
              <TableHead>{t('orders.date')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>{t(`orders.${order.status}`)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={paymentVariant[order.payment_status]}>{t(`orders.${order.payment_status}`)}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </CardContent>
    </Card>
  );
}
