'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase, isMockMode } from '@/lib/supabase';
import { mockUsers, mockOrders } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format-price';
import type { UserProfile } from '@/types/user';
import type { Order, OrderStatus } from '@/types/order';

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline', confirmed: 'secondary', processing: 'secondary',
  shipped: 'default', delivered: 'default', completed: 'default', cancelled: 'destructive', returned: 'destructive',
};

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (isMockMode) {
        const mockUser = mockUsers.find((u) => u.id === id) || null;
        setUser(mockUser);
        setUserOrders(mockUser ? mockOrders.filter((o) => o.user_id === id) : []);
        setNotFound(!mockUser);
        setLoading(false);
        return;
      }

      try {
        // Fetch profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, phone, city, address, is_admin, created_at, updated_at')
          .eq('id', id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          setNotFound(true);
          setLoading(false);
          return;
        }

        // Fetch orders for this user, including order_items
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('user_id', id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
        }

        // Get email from the first order if available
        const email = orders?.find((o) => o.customer_email)?.customer_email || undefined;

        // Map profile to UserProfile
        const mappedUser: UserProfile = {
          id: profile.id,
          full_name: profile.full_name,
          phone: profile.phone,
          city: profile.city,
          address: profile.address,
          is_admin: profile.is_admin ?? false,
          email,
          preferred_language: 'ka' as const,
          orders_count: orders?.length || 0,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        };

        // Map orders to Order type
        const mappedOrders: Order[] = (orders || []).map((o) => ({
          id: o.id,
          order_number: o.order_number,
          user_id: o.user_id,
          status: o.status,
          payment_status: o.payment_status,
          payment_method: o.payment_method,
          payment_transaction_id: o.payment_transaction_id,
          subtotal: o.subtotal,
          shipping_cost: o.shipping_cost,
          total: o.total,
          currency: o.currency || 'GEL',
          customer_name: o.customer_name,
          customer_phone: o.customer_phone,
          customer_email: o.customer_email,
          delivery_city: o.delivery_city,
          delivery_address: o.delivery_address,
          delivery_postal_code: o.delivery_postal_code,
          delivery_method: o.delivery_method,
          notes: o.notes,
          items: (o.order_items || []).map((item: Record<string, unknown>) => ({
            id: item.id as string,
            order_id: item.order_id as string,
            product_id: item.product_id as string | null,
            product_name: item.product_name as string,
            product_sku: item.product_sku as string | null,
            quantity: item.quantity as number,
            unit_price: item.unit_price as number,
            total_price: item.total_price as number,
          })),
          created_at: o.created_at,
          updated_at: o.updated_at,
        }));

        setUser(mappedUser);
        setUserOrders(mappedOrders);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        // Fallback to mock data
        const mockUser = mockUsers.find((u) => u.id === id) || null;
        setUser(mockUser);
        setUserOrders(mockUser ? mockOrders.filter((o) => o.user_id === id) : []);
        setNotFound(!mockUser);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (notFound || !user) {
    return <p className="text-center py-20 text-muted-foreground">{t('common.error')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/users">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <h1 className="text-xl font-semibold">{user.full_name || '—'}</h1>
        {user.is_admin && <Badge>Admin</Badge>}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user.email || '—'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('users.phone')}</span><span>{user.phone || '—'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('users.city')}</span><span>{user.city || '—'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('users.address')}</span><span>{user.address || '—'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">{t('users.registered')}</span><span>{new Date(user.created_at).toLocaleDateString()}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">{t('users.userOrders')} ({userOrders.length})</CardTitle></CardHeader>
        <CardContent>
          {userOrders.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">{t('orders.noOrders')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('orders.orderNumber')}</TableHead>
                  <TableHead>{t('orders.total')}</TableHead>
                  <TableHead>{t('orders.status')}</TableHead>
                  <TableHead>{t('orders.date')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/orders/${order.id}`} className="font-medium hover:underline">
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[order.status]}>{t(`orders.${order.status}`)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
