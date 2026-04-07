'use client';

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductsTable } from './_components/products-table';
import { CreateProductDialog } from './_components/create-product-dialog';
import { mockProducts, mockCategories } from '@/lib/mock-data';
import { useLanguageStore } from '@/stores/language-store';
import { useDebounce } from 'use-debounce';
import { supabase, isMockMode } from '@/lib/supabase';
import type { Product } from '@/types/product';
import type { Category } from '@/types/category';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 300);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);

  const fetchData = async () => {
    if (isMockMode) return;
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (prodRes.data) setProducts(prodRes.data as Product[]);
    if (catRes.data) setCategories(catRes.data as Category[]);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) => p.name_ka.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category_id === categoryFilter);
    }
    return result;
  }, [debouncedSearch, categoryFilter, products]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('products.title')}</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('products.addProduct')}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder={t('products.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="sm:w-[200px]">
            <SelectValue placeholder={t('products.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('products.allCategories')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {language === 'ka' ? cat.name_ka : cat.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <ProductsTable products={filtered} onRefresh={fetchData} />
      <CreateProductDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={fetchData} />
    </div>
  );
}
