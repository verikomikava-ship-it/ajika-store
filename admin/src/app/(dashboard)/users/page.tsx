'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase, isMockMode } from '@/lib/supabase';
import { mockUsers } from '@/lib/mock-data';
import { useDebounce } from 'use-debounce';
import type { UserProfile } from '@/types/user';

export default function UsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    if (isMockMode) {
      setUsers(mockUsers);
      setLoading(false);
      return;
    }

    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, phone, city, address, is_admin, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setUsers(mockUsers);
        setLoading(false);
        return;
      }

      const { data: orderCounts } = await supabase
        .from('orders')
        .select('user_id, customer_email');

      const orderCountMap: Record<string, number> = {};
      const emailMap: Record<string, string> = {};
      if (orderCounts) {
        for (const order of orderCounts) {
          orderCountMap[order.user_id] = (orderCountMap[order.user_id] || 0) + 1;
          if (order.customer_email && !emailMap[order.user_id]) {
            emailMap[order.user_id] = order.customer_email;
          }
        }
      }

      const mappedUsers: UserProfile[] = (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        city: p.city,
        address: p.address,
        is_admin: p.is_admin ?? false,
        email: emailMap[p.id] || undefined,
        preferred_language: 'ka' as const,
        orders_count: orderCountMap[p.id] || 0,
        created_at: p.created_at,
        updated_at: p.updated_at,
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  }

  const toggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    if (isMockMode) return;

    const newValue = !currentIsAdmin;

    // Optimistic update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_admin: newValue } : u))
    );

    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: newValue })
      .eq('id', userId);

    if (error) {
      // Revert on error
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_admin: currentIsAdmin } : u))
      );
      console.error('Failed to update admin status:', error);
    }
  };

  const filtered = useMemo(() => {
    if (!debouncedSearch) return users;
    const q = debouncedSearch.toLowerCase();
    return users.filter(u =>
      (u.full_name && u.full_name.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  }, [debouncedSearch, users]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('users.title')}</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{t('users.title')}</h1>

      <Input
        placeholder={t('common.search') + '...'}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      {filtered.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">{t('users.noUsers')}</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('users.name')}</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>{t('users.phone')}</TableHead>
                <TableHead>{t('users.ordersCount')}</TableHead>
                <TableHead>{t('users.registered')}</TableHead>
                <TableHead>Admin</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Link href={`/users/${user.id}`} className="font-medium hover:underline">
                      {user.full_name || '—'}
                    </Link>
                    {user.is_admin && <Badge variant="default" className="ml-2 text-[10px]">Admin</Badge>}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.email || '—'}</TableCell>
                  <TableCell className="text-sm">{user.phone || '—'}</TableCell>
                  <TableCell>{user.orders_count ?? 0}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={user.is_admin ? 'destructive' : 'outline'}
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => toggleAdmin(user.id, user.is_admin)}
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="w-3 h-3" />
                          წართმევა
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3" />
                          მიცემა
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
