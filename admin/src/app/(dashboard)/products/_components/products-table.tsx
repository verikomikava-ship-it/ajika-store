'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EditProductDialog } from './edit-product-dialog';
import { formatPrice } from '@/lib/format-price';
import { useLanguageStore } from '@/stores/language-store';
import { supabase, isMockMode } from '@/lib/supabase';
import type { Product } from '@/types/product';

interface ProductsTableProps {
  products: Product[];
  onRefresh?: () => void;
}

export function ProductsTable({ products, onRefresh }: ProductsTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const handleDelete = async () => {
    if (!deleteProduct || isMockMode) { setDeleteProduct(null); return; }

    await supabase.from('product_images').delete().eq('product_id', deleteProduct.id);
    await supabase.from('products').delete().eq('id', deleteProduct.id);
    setDeleteProduct(null);
    onRefresh?.();
  };

  const toggleActive = async (product: Product) => {
    if (isMockMode) return;
    await supabase.from('products').update({ is_active: !product.is_active }).eq('id', product.id);
    onRefresh?.();
  };

  if (products.length === 0) {
    return <p className="text-center text-muted-foreground py-10">{t('products.noProducts')}</p>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">{t('products.image')}</TableHead>
              <TableHead>{t('products.name')}</TableHead>
              <TableHead>{t('products.category')}</TableHead>
              <TableHead>{t('products.price')}</TableHead>
              <TableHead>{t('products.stock')}</TableHead>
              <TableHead>{t('products.featured')}</TableHead>
              <TableHead>{t('products.active')}</TableHead>
              <TableHead className="w-[100px]">{t('products.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xs overflow-hidden">
                    {product.images?.[0] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                    ) : '—'}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{language === 'ka' ? product.name_ka : product.name_en}</p>
                    <p className="text-xs text-muted-foreground">{product.brand} · {product.sku}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {product.category ? (language === 'ka' ? product.category.name_ka : product.category.name_en) : '—'}
                </TableCell>
                <TableCell>
                  <div>
                    {product.sale_price ? (
                      <>
                        <span className="font-medium text-green-500">{formatPrice(product.sale_price)}</span>
                        <span className="text-xs text-muted-foreground line-through ml-1">{formatPrice(product.price)}</span>
                      </>
                    ) : (
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={product.stock_quantity < 10 ? 'destructive' : 'secondary'}>
                    {product.stock_quantity}
                  </Badge>
                </TableCell>
                <TableCell>
                  {product.is_featured ? (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ) : (
                    <StarOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell>
                  <Switch checked={product.is_active} onCheckedChange={() => toggleActive(product)} />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditProduct(product)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteProduct(product)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditProductDialog product={editProduct} onClose={() => setEditProduct(null)} onSaved={onRefresh} />

      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('products.deleteProduct')}</AlertDialogTitle>
            <AlertDialogDescription>{t('products.deleteDescription')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
