'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Package, Truck, CheckCircle2, Flag, XCircle, Zap, Loader2, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockOrders } from '@/lib/mock-data';
import { supabase, isMockMode } from '@/lib/supabase';
import { formatPrice } from '@/lib/format-price';
import { useDebounce } from 'use-debounce';
import type { Order, OrderStatus, PaymentStatus } from '@/types/order';

const paymentVariant: Record<PaymentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'outline', paid: 'default', failed: 'destructive', refunded: 'secondary',
};

// 4-step pipeline
const STEPS: { status: OrderStatus; icon: typeof Package; color: string; activeColor: string }[] = [
  { status: 'pending', icon: Package, color: 'text-muted-foreground', activeColor: 'bg-blue-500 text-white' },
  { status: 'shipped', icon: Truck, color: 'text-muted-foreground', activeColor: 'bg-amber-500 text-white' },
  { status: 'delivered', icon: CheckCircle2, color: 'text-muted-foreground', activeColor: 'bg-emerald-500 text-white' },
  { status: 'completed', icon: Flag, color: 'text-muted-foreground', activeColor: 'bg-primary text-white' },
];

function getStepIndex(status: OrderStatus): number {
  if (status === 'pending' || status === 'confirmed' || status === 'processing') return 0;
  if (status === 'shipped') return 1;
  if (status === 'delivered') return 2;
  if (status === 'completed') return 3;
  return -1; // cancelled/returned
}

type Tab = 'active' | 'express' | 'shipped' | 'completed' | 'cancelled' | 'all';

export default function OrdersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<Tab>('active');
  const [debouncedSearch] = useDebounce(search, 300);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailStatus, setEmailStatus] = useState<Record<string, 'sending' | 'sent' | 'failed'>>({});

  useEffect(() => {
    async function fetchOrders() {
      if (isMockMode) { setOrders(mockOrders); setLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders((data as Order[]) ?? []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders(mockOrders);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const sendStatusEmail = async (order: Order, status: 'shipped' | 'delivered') => {
    if (!order.customer_email) return;
    setEmailStatus((prev) => ({ ...prev, [order.id]: 'sending' }));
    try {
      const res = await fetch('https://carstu.store/api/send-status-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          orderNumber: order.order_number,
          status,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setEmailStatus((prev) => ({ ...prev, [order.id]: 'sent' }));
    } catch {
      setEmailStatus((prev) => ({ ...prev, [order.id]: 'failed' }));
    }
    setTimeout(() => setEmailStatus((prev) => { const n = { ...prev }; delete n[order.id]; return n; }), 3000);
  };

  const updateStatus = async (order: Order, newStatus: OrderStatus) => {
    const prevStatus = order.status;
    setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: newStatus } : o));

    if (!isMockMode) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', order.id);
        if (error) throw error;
      } catch (err) {
        console.error('Failed to update:', err);
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: prevStatus } : o));
        return;
      }
    }

    // Send email on shipped or delivered
    if (newStatus === 'shipped' || newStatus === 'delivered') {
      sendStatusEmail(order, newStatus);
    }
  };

  const counts = useMemo(() => ({
    active: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length,
    express: orders.filter(o => o.delivery_method === 'express' && ['pending', 'confirmed', 'processing'].includes(o.status)).length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    completed: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length,
    all: orders.length,
  }), [orders]);

  const filtered = useMemo(() => {
    let result = orders;
    switch (tab) {
      case 'active': result = result.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)); break;
      case 'express': result = result.filter(o => o.delivery_method === 'express' && ['pending', 'confirmed', 'processing'].includes(o.status)); break;
      case 'shipped': result = result.filter(o => o.status === 'shipped'); break;
      case 'completed': result = result.filter(o => o.status === 'delivered' || o.status === 'completed'); break;
      case 'cancelled': result = result.filter(o => o.status === 'cancelled' || o.status === 'returned'); break;
    }
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(o => o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q));
    }
    return result;
  }, [orders, tab, debouncedSearch]);

  const tabs: { key: Tab; label: string; count: number; icon?: typeof Zap }[] = [
    { key: 'active', label: t('orders.tabActive'), count: counts.active },
    { key: 'express', label: t('orders.tabExpress'), count: counts.express, icon: Zap },
    { key: 'shipped', label: t('orders.tabShipped'), count: counts.shipped },
    { key: 'completed', label: t('orders.tabCompleted'), count: counts.completed },
    { key: 'cancelled', label: t('orders.tabCancelled'), count: counts.cancelled },
    { key: 'all', label: t('orders.tabAll'), count: counts.all },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('orders.title')}</h1>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {tabs.map((item) => {
          const isActive = tab === item.key;
          const isExpress = item.key === 'express';
          return (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                ${isActive
                  ? isExpress ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted'
                }`}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              {item.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full
                ${isActive
                  ? isExpress ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-primary/15 text-primary'
                  : 'bg-muted text-muted-foreground'
                }`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      <Input placeholder={t('common.search') + '...'} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

      {loading ? (
        <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">{t('orders.noOrders')}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isExpress = order.delivery_method === 'express';
            const isCancelled = order.status === 'cancelled' || order.status === 'returned';
            const currentStep = getStepIndex(order.status);
            const eStatus = emailStatus[order.id];

            return (
              <div key={order.id} className={`bg-card border rounded-xl p-4 ${isExpress ? 'border-amber-500/30' : 'border-border'}`}>
                {/* Top row: order info */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/orders/${order.id}`} className="text-sm font-bold hover:underline">
                      {order.order_number}
                    </Link>
                    {isExpress && (
                      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[10px] px-1.5 py-0">
                        <Zap className="w-2.5 h-2.5 mr-0.5" />
                        {t('orders.express')}
                      </Badge>
                    )}
                    <Badge variant={paymentVariant[order.payment_status]}>{t(`orders.${order.payment_status}`)}</Badge>
                    {eStatus && (
                      <span className={`flex items-center gap-1 text-[11px] font-medium ${
                        eStatus === 'sending' ? 'text-blue-500' : eStatus === 'sent' ? 'text-emerald-500' : 'text-red-500'
                      }`}>
                        <Mail className="w-3 h-3" />
                        {t(`orders.${eStatus === 'sending' ? 'sendingEmail' : eStatus === 'sent' ? 'emailSent' : 'emailFailed'}`)}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{formatPrice(order.total)}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Customer info */}
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{order.customer_name}</span>
                  <span>{order.customer_phone}</span>
                  <span>{order.delivery_city}</span>
                </div>

                {/* 4-Step Pipeline */}
                {isCancelled ? (
                  <div className="flex items-center gap-2 py-2">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <span className="text-sm font-medium text-destructive">{t(`orders.${order.status}`)}</span>
                    <Button variant="outline" size="sm" className="ml-auto h-7 text-xs" onClick={() => updateStatus(order, 'pending')}>
                      აღდგენა
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    {STEPS.map((step, i) => {
                      const isCompleted = currentStep > i;
                      const isCurrent = currentStep === i;
                      const isNext = currentStep === i - 1;
                      const Icon = step.icon;

                      return (
                        <div key={step.status} className="flex items-center flex-1">
                          <button
                            onClick={() => {
                              if (isNext) updateStatus(order, step.status);
                            }}
                            disabled={!isNext}
                            className={`flex items-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-medium transition-all
                              ${isCompleted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
                              ${isCurrent ? step.activeColor + ' shadow-sm' : ''}
                              ${isNext ? 'bg-muted hover:bg-primary/10 hover:text-primary cursor-pointer border-2 border-dashed border-primary/30' : ''}
                              ${!isCompleted && !isCurrent && !isNext ? 'bg-muted/50 text-muted-foreground/50' : ''}
                            `}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            <span className="hidden sm:inline">{t(`orders.step${i + 1}`)}</span>
                          </button>
                          {i < STEPS.length - 1 && (
                            <div className={`w-3 h-0.5 flex-shrink-0 mx-0.5 ${isCompleted ? 'bg-emerald-500' : 'bg-border'}`} />
                          )}
                        </div>
                      );
                    })}

                    {/* Cancel button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                      onClick={() => updateStatus(order, 'cancelled')}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
