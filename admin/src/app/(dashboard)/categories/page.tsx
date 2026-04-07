'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, ChevronRight, FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { mockCategories } from '@/lib/mock-data';
import { useLanguageStore } from '@/stores/language-store';
import { supabase, isMockMode } from '@/lib/supabase';
import type { Category } from '@/types/category';

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { language } = useLanguageStore();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [createParentId, setCreateParentId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Create form
  const [cNameKa, setCNameKa] = useState('');
  const [cNameEn, setCNameEn] = useState('');
  const [cSlug, setCSlug] = useState('');
  const [cIcon, setCIcon] = useState('');
  const [cSort, setCSort] = useState('0');

  // Edit form
  const [eNameKa, setENameKa] = useState('');
  const [eNameEn, setENameEn] = useState('');
  const [eSlug, setESlug] = useState('');
  const [eIcon, setEIcon] = useState('');
  const [eSort, setESort] = useState('0');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    if (isMockMode) { setLoading(false); return; }
    const { data } = await supabase.from('categories').select('*').order('sort_order');
    if (data) setCategories(data as Category[]);
    setLoading(false);
  }

  // Get parent categories (no parent_id)
  const parentCategories = categories.filter((c) => !c.parent_id);
  // Get subcategories for a parent
  const getSubcategories = (parentId: string) => categories.filter((c) => c.parent_id === parentId);

  const openCreate = (parentId: string | null = null) => {
    setCreateParentId(parentId);
    setCNameKa(''); setCNameEn(''); setCSlug(''); setCIcon(''); setCSort('0');
    setError('');
    setCreateOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditCategory(cat);
    setENameKa(cat.name_ka);
    setENameEn(cat.name_en);
    setESlug(cat.slug);
    setEIcon(cat.icon || '');
    setESort(String(cat.sort_order));
    setError('');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cNameKa || !cSlug) { setError('შეავსეთ სახელი და slug'); return; }
    if (isMockMode) { setCreateOpen(false); return; }

    setSaving(true);
    setError('');
    try {
      const { error: insertError } = await supabase.from('categories').insert({
        name_ka: cNameKa,
        name_en: cNameEn || cNameKa,
        slug: cSlug,
        icon: cIcon || null,
        sort_order: parseInt(cSort) || 0,
        parent_id: createParentId || null,
        is_active: true,
      });
      if (insertError) throw insertError;
      setCreateOpen(false);
      fetchCategories();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || 'შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCategory || !eNameKa || !eSlug) { setError('შეავსეთ სახელი და slug'); return; }
    if (isMockMode) { setEditCategory(null); return; }

    setSaving(true);
    setError('');
    try {
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          name_ka: eNameKa,
          name_en: eNameEn || eNameKa,
          slug: eSlug,
          icon: eIcon || null,
          sort_order: parseInt(eSort) || 0,
        })
        .eq('id', editCategory.id);
      if (updateError) throw updateError;
      setEditCategory(null);
      fetchCategories();
    } catch (err: unknown) {
      setError((err instanceof Error ? err.message : null) || 'შეცდომა');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCategory || isMockMode) { setDeleteCategory(null); return; }

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', deleteCategory.id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
    }
    setDeleteCategory(null);
    fetchCategories();
  };

  const toggleActive = async (cat: Category) => {
    if (isMockMode) return;
    const newValue = !cat.is_active;
    setCategories((prev) => prev.map((c) => c.id === cat.id ? { ...c, is_active: newValue } : c));
    await supabase.from('categories').update({ is_active: newValue }).eq('id', cat.id);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
        <Button onClick={() => openCreate(null)}>
          <Plus className="w-4 h-4 mr-2" />
          {t('categories.addCategory')}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('categories.icon')}</TableHead>
              <TableHead>{t('products.name')}</TableHead>
              <TableHead>{t('categories.slug')}</TableHead>
              <TableHead>{t('categories.sortOrder')}</TableHead>
              <TableHead>{t('products.active')}</TableHead>
              <TableHead className="w-[140px]">{t('products.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentCategories.map((cat) => {
              const subs = getSubcategories(cat.id);
              return (
                <>
                  <TableRow key={cat.id} className="bg-muted/30">
                    <TableCell className="text-xl">{cat.icon}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{language === 'ka' ? cat.name_ka : cat.name_en}</p>
                        <p className="text-xs text-muted-foreground">{language === 'ka' ? cat.name_en : cat.name_ka}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{cat.slug}</TableCell>
                    <TableCell><Badge variant="secondary">{cat.sort_order}</Badge></TableCell>
                    <TableCell>
                      <Switch checked={cat.is_active} onCheckedChange={() => toggleActive(cat)} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openCreate(cat.id)} title="ქვეკატეგორიის დამატება">
                          <FolderPlus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(cat)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteCategory(cat)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {subs.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="text-lg pl-8">
                        <span className="text-muted-foreground mr-1"><ChevronRight className="w-3 h-3 inline" /></span>
                        {sub.icon}
                      </TableCell>
                      <TableCell>
                        <div className="pl-4">
                          <p className="font-medium text-sm">{language === 'ka' ? sub.name_ka : sub.name_en}</p>
                          <p className="text-xs text-muted-foreground">{language === 'ka' ? sub.name_en : sub.name_ka}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{sub.slug}</TableCell>
                      <TableCell><Badge variant="outline">{sub.sort_order}</Badge></TableCell>
                      <TableCell>
                        <Switch checked={sub.is_active} onCheckedChange={() => toggleActive(sub)} />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(sub)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteCategory(sub)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createParentId
                ? `ქვეკატეგორიის დამატება — ${categories.find((c) => c.id === createParentId)?.name_ka || ''}`
                : t('categories.addCategory')}
            </DialogTitle>
          </DialogHeader>
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('products.nameKa')}</Label>
                <Input placeholder="კატეგორიის სახელი" value={cNameKa} onChange={(e) => setCNameKa(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{t('products.nameEn')}</Label>
                <Input placeholder="Category name" value={cNameEn} onChange={(e) => setCNameEn(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('categories.slug')}</Label>
                <Input placeholder="category-slug" value={cSlug} onChange={(e) => setCSlug(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>{t('categories.icon')}</Label>
                <Input placeholder="📱" value={cIcon} onChange={(e) => setCIcon(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t('categories.sortOrder')}</Label>
              <Input type="number" min="0" value={cSort} onChange={(e) => setCSort(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={saving}>{saving ? t('common.loading') : t('common.save')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('categories.editCategory')}</DialogTitle>
          </DialogHeader>
          {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg">{error}</div>}
          {editCategory && (
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('products.nameKa')}</Label>
                  <Input value={eNameKa} onChange={(e) => setENameKa(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('products.nameEn')}</Label>
                  <Input value={eNameEn} onChange={(e) => setENameEn(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('categories.slug')}</Label>
                  <Input value={eSlug} onChange={(e) => setESlug(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>{t('categories.icon')}</Label>
                  <Input value={eIcon} onChange={(e) => setEIcon(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('categories.sortOrder')}</Label>
                <Input type="number" value={eSort} onChange={(e) => setESort(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditCategory(null)}>{t('common.cancel')}</Button>
                <Button type="submit" disabled={saving}>{saving ? t('common.loading') : t('common.save')}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('categories.deleteCategory')}</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleteCategory?.name_ka}&quot; — {getSubcategories(deleteCategory?.id || '').length > 0
                ? 'ამ კატეგორიას აქვს ქვეკატეგორიები. წაშლის შემდეგ ისინი მშობელს დაკარგავენ.'
                : t('categories.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>{t('common.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
