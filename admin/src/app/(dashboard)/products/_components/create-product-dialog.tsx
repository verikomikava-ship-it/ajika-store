'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ImagePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockCategories } from '@/lib/mock-data';
import { useLanguageStore } from '@/stores/language-store';
import { supabase, isMockMode } from '@/lib/supabase';
import type { Category } from '@/types/category';

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateProductDialog({ open, onOpenChange, onCreated }: CreateProductDialogProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [nameKa, setNameKa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descKa, setDescKa] = useState('');
  const [descEn, setDescEn] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [brand, setBrand] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    if (isMockMode) return;
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  const resetForm = () => {
    setNameKa(''); setNameEn(''); setDescKa(''); setDescEn('');
    setPrice(''); setSalePrice(''); setStock('0');
    setCategoryId(''); setBrand('');
    setIsActive(true); setIsFeatured(false);
    setError('');
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setPreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nameKa || !price || !categoryId) {
      setError('შეავსეთ სახელი, ფასი და კატეგორია');
      return;
    }

    if (isMockMode) {
      resetForm();
      onOpenChange(false);
      return;
    }

    setSaving(true);
    try {
      const slug = nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || nameKa;

      const { data: product, error: insertError } = await supabase
        .from('products')
        .insert({
          name_ka: nameKa,
          name_en: nameEn || nameKa,
          description_ka: descKa || null,
          description_en: descEn || null,
          price: parseFloat(price),
          sale_price: salePrice ? parseFloat(salePrice) : null,
          stock_quantity: parseInt(stock) || 0,
          category_id: categoryId,
          brand: brand || null,
          is_active: isActive,
          is_featured: isFeatured,
          sku: slug,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload images if any
      for (let i = 0; i < previews.length; i++) {
        const file = previews[i].file;
        const ext = file.name.split('.').pop();
        const filePath = `products/${product.id}/${i}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

          await supabase.from('product_images').insert({
            product_id: product.id,
            url: urlData.publicUrl,
            sort_order: i,
            is_primary: i === 0,
          });
        }
      }

      resetForm();
      onOpenChange(false);
      onCreated?.();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || 'შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('products.addProduct')}</DialogTitle>
        </DialogHeader>
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.nameKa')}</Label>
              <Input placeholder="პროდუქტის სახელი" value={nameKa} onChange={(e) => setNameKa(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('products.nameEn')}</Label>
              <Input placeholder="Product name" value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.descriptionKa')}</Label>
              <Textarea rows={3} value={descKa} onChange={(e) => setDescKa(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('products.descriptionEn')}</Label>
              <Textarea rows={3} value={descEn} onChange={(e) => setDescEn(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('products.price')}</Label>
              <Input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('products.salePrice')}</Label>
              <Input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('products.stock')}</Label>
              <Input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.category')}</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('products.category')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {language === 'ka' ? cat.name_ka : cat.name_en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('products.brand')}</Label>
              <Input value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>{t('products.images')}</Label>
            <div className="flex flex-wrap gap-3">
              {previews.map((preview, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg border overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[9px] text-center py-0.5">
                      {t('products.mainImage')}
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <ImagePlus className="w-5 h-5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{t('products.addImage')}</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              className="hidden"
            />
            <p className="text-xs text-muted-foreground">{t('products.imageHint')}</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="active">{t('products.active')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="featured">{t('products.featured')}</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t('common.loading') : t('common.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
