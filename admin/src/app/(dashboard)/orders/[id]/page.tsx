'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockOrders } from '@/lib/mock-data';
import { supabase, isMockMode } from '@/lib/supabase';
import { formatPrice } from '@/lib/format-price';
import type { Order, OrderStatus, PaymentStatus } from '@/types/order';

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline', confirmed: 'secondary', processing: 'secondary',
  shipped: 'default', delivered: 'default', completed: 'default', cancelled: 'destructive', returned: 'destructive',
};

const paymentVariant: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline', paid: 'default', failed: 'destructive', refunded: 'secondary',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (isMockMode) {
        setOrder(mockOrders.find((o) => o.id === id) ?? null);
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .eq('id', id)
          .single();
        if (error) throw error;
        setOrder(data as Order);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setOrder(mockOrders.find((o) => o.id === id) ?? null);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-center py-20 text-muted-foreground">{t('common.error')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{order.order_number}</h1>
          <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
        </div>
        <Badge variant={statusVariant[order.status]} className="text-sm">{t(`orders.${order.status}`)}</Badge>
        <Badge variant={paymentVariant[order.payment_status]} className="text-sm">{t(`orders.${order.payment_status}`)}</Badge>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">{t('orders.updateStatus')}:</span>
        <Select defaultValue={order.status}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">{t('orders.pending')}</SelectItem>
            <SelectItem value="confirmed">{t('orders.confirmed')}</SelectItem>
            <SelectItem value="processing">{t('orders.processing')}</SelectItem>
            <SelectItem value="shipped">{t('orders.shipped')}</SelectItem>
            <SelectItem value="delivered">{t('orders.delivered')}</SelectItem>
            <SelectItem value="cancelled">{t('orders.cancelled')}</SelectItem>
            <SelectItem value="returned">{t('orders.returned')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">{t('orders.deliveryInfo')}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('orders.customer')}</span><span>{order.customer_name}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('orders.phone')}</span><span>{order.customer_phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span>{order.delivery_city}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span>{order.delivery_address}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">{t('orders.total')}</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">{t('orders.subtotal')}</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t('orders.shipping')}</span><span>{order.shipping_cost === 0 ? t('orders.free') : formatPrice(order.shipping_cost)}</span></div>
            <div className="border-t pt-2 flex justify-between font-bold"><span>{t('orders.total')}</span><span>{formatPrice(order.total)}</span></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">{t('orders.orderItems')}</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('products.name')}</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>{t('products.price')}</TableHead>
                <TableHead>{t('orders.total')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatPrice(item.unit_price)}</TableCell>
                  <TableCell className="font-medium">{formatPrice(item.total_price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
