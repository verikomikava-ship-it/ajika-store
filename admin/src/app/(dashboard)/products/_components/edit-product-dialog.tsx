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
import type { Product, ProductImage } from '@/types/product';
import type { Category } from '@/types/category';

interface EditProductDialogProps {
  product: Product | null;
  onClose: () => void;
  onSaved?: () => void;
}

export function EditProductDialog({ product, onClose, onSaved }: EditProductDialogProps) {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Controlled form state
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
  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [newPreviews, setNewPreviews] = useState<{ file: File; url: string }[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (isMockMode) return;
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      if (data) setCategories(data as Category[]);
    });
  }, []);

  useEffect(() => {
    if (product) {
      setNameKa(product.name_ka);
      setNameEn(product.name_en);
      setDescKa(product.description_ka || '');
      setDescEn(product.description_en || '');
      setPrice(String(product.price));
      setSalePrice(product.sale_price ? String(product.sale_price) : '');
      setStock(String(product.stock_quantity));
      setCategoryId(product.category_id);
      setBrand(product.brand || '');
      setIsActive(product.is_active);
      setIsFeatured(product.is_featured);
      setExistingImages(product.images || []);
      setNewPreviews([]);
      setRemovedImageIds([]);
      setError('');
    }
  }, [product]);

  if (!product) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewPreviews((prev) => [...prev, ...previews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeExisting = (imageId: string) => {
    setRemovedImageIds((prev) => [...prev, imageId]);
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const removeNew = (index: number) => {
    setNewPreviews((prev) => {
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

    if (isMockMode) { handleClose(); return; }

    setSaving(true);
    try {
      // Update product
      const { error: updateError } = await supabase
        .from('products')
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (updateError) throw updateError;

      // Delete removed images from DB
      if (removedImageIds.length > 0) {
        await supabase.from('product_images').delete().in('id', removedImageIds);
      }

      // Upload new images
      for (let i = 0; i < newPreviews.length; i++) {
        const file = newPreviews[i].file;
        const ext = file.name.split('.').pop();
        const filePath = `products/${product.id}/${Date.now()}-${i}.${ext}`;

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
            sort_order: existingImages.length + i,
            is_primary: existingImages.length === 0 && i === 0,
          });
        }
      }

      newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
      setNewPreviews([]);
      onClose();
      onSaved?.();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || 'შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    newPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    setNewPreviews([]);
    onClose();
  };

  const totalImages = existingImages.length + newPreviews.length;

  return (
    <Dialog open={!!product} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('products.editProduct')}</DialogTitle>
        </DialogHeader>
        {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('products.nameKa')}</Label>
              <Input value={nameKa} onChange={(e) => setNameKa(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('products.nameEn')}</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} />
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
                  <SelectValue />
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
            <Label>{t('products.images')} ({totalImages})</Label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, i) => (
                <div key={img.id} className="relative w-20 h-20 rounded-lg border overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt_text || ''} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExisting(img.id)}
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
              {newPreviews.map((preview, i) => (
                <div key={`new-${i}`} className="relative w-20 h-20 rounded-lg border border-dashed border-green-500/50 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNew(i)}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <span className="absolute top-0.5 right-0.5 bg-green-500 text-white text-[8px] px-1 rounded">NEW</span>
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
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch id="edit-active" checked={isActive} onCheckedChange={setIsActive} />
              <Label htmlFor="edit-active">{t('products.active')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="edit-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
              <Label htmlFor="edit-featured">{t('products.featured')}</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
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
