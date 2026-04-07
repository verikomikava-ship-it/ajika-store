'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  BarChart3, Package, FolderTree, ShoppingCart, Users, LogOut, Globe,
} from 'lucide-react';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { supabase, isMockMode } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth-store';
import { useLanguageStore } from '@/stores/language-store';

export function AppSidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const setIsAdmin = useAuthStore((s) => s.setIsAdmin);
  const { language, setLanguage } = useLanguageStore();

  const navigation = [
    {
      label: t('sidebar.dashboard'),
      items: [
        { title: t('sidebar.dashboard'), url: '/dashboard', icon: BarChart3 },
      ],
    },
    {
      label: t('sidebar.catalog'),
      items: [
        { title: t('sidebar.products'), url: '/products', icon: Package },
        { title: t('sidebar.categories'), url: '/categories', icon: FolderTree },
      ],
    },
    {
      label: t('sidebar.sales'),
      items: [
        { title: t('sidebar.orders'), url: '/orders', icon: ShoppingCart },
      ],
    },
    {
      label: t('sidebar.people'),
      items: [
        { title: t('sidebar.users'), url: '/users', icon: Users },
      ],
    },
  ];

  const handleSignOut = async () => {
    if (!isMockMode) await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CT</span>
          </div>
          <span className="font-semibold text-sm">Carstu</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + '/')}>
                      <Link href={item.url}>
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        <div className="flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-xs font-medium">{(user?.email?.[0] || 'A').toUpperCase()}</span>
          </div>
          <span className="text-xs text-sidebar-foreground/70 truncate flex-1">
            {user?.email || 'admin@demo.com'}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={() => setLanguage(language === 'ka' ? 'en' : 'ka')}
          >
            <Globe className="w-3 h-3 mr-1" />
            {language === 'ka' ? 'EN' : 'KA'}
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs" onClick={handleSignOut}>
            <LogOut className="w-3 h-3 mr-1" />
            {t('auth.signOut')}
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
