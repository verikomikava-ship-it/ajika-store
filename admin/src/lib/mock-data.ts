import { Category } from '@/types/category';
import { Product } from '@/types/product';
import { Order } from '@/types/order';
import { UserProfile } from '@/types/user';

const now = new Date().toISOString();

export const mockCategories: Category[] = [
  { id: '1', slug: 'tech-gadgets', name_ka: 'ტექნოლოგია და გაჯეტები', name_en: 'Tech & Gadgets', icon: '📱', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 0, is_active: true, created_at: now },
  { id: '2', slug: 'cleaning-care', name_ka: 'სისუფთავე და მოვლა', name_en: 'Cleaning & Care', icon: '🧹', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 1, is_active: true, created_at: now },
  { id: '3', slug: 'organization', name_ka: 'ორგანიზაცია და სივრცე', name_en: 'Organization & Space', icon: '📦', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 2, is_active: true, created_at: now },
  { id: '4', slug: 'comfort', name_ka: 'კომფორტი', name_en: 'Comfort', icon: '😌', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 3, is_active: true, created_at: now },
  { id: '5', slug: 'interior-style', name_ka: 'ინტერიერის დიზაინი', name_en: 'Interior Style', icon: '✨', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 4, is_active: true, created_at: now },
  { id: '6', slug: 'safety-emergency', name_ka: 'უსაფრთხოება', name_en: 'Safety & Emergency', icon: '🛠️', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 5, is_active: true, created_at: now },
  { id: '7', slug: 'daily-essentials', name_ka: 'ყოველდღიური Must-Have', name_en: 'Daily Essentials', icon: '🧰', description_ka: null, description_en: null, image_url: null, parent_id: null, sort_order: 6, is_active: true, created_at: now },
];

const productData = [
  { name_ka: 'ტელეფონის მაგნიტური დამჭერი', name_en: 'Magnetic Phone Holder', price: 25, sale_price: 19 as number | null, cat: '1', brand: 'Baseus', featured: true, stock: 45 },
  { name_ka: 'USB-C სწრაფი დამტენი', name_en: 'USB-C Fast Charger', price: 35, sale_price: null as number | null, cat: '1', brand: 'Anker', featured: true, stock: 30 },
  { name_ka: 'Bluetooth FM ტრანსმიტერი', name_en: 'Bluetooth FM Transmitter', price: 29, sale_price: 22 as number | null, cat: '1', brand: 'Ugreen', featured: true, stock: 20 },
  { name_ka: 'ვიდეორეგისტრატორი 1080P', name_en: '1080P Dash Camera', price: 89, sale_price: 69 as number | null, cat: '1', brand: 'Viofo', featured: true, stock: 12 },
  { name_ka: 'მანქანის მტვერსასრუტი', name_en: 'Portable Car Vacuum', price: 55, sale_price: null as number | null, cat: '2', brand: 'Xiaomi', featured: true, stock: 25 },
  { name_ka: 'მიკროფიბრის ნაკრები (5ც)', name_en: 'Microfiber Cloth Set (5pc)', price: 15, sale_price: 12 as number | null, cat: '2', brand: 'ChemicalGuys', featured: false, stock: 100 },
  { name_ka: 'საწმენდი გელი', name_en: 'Cleaning Gel', price: 10, sale_price: null as number | null, cat: '2', brand: 'AutoClean', featured: false, stock: 80 },
  { name_ka: 'საბარგულის ორგანიზატორი', name_en: 'Trunk Organizer', price: 45, sale_price: 35 as number | null, cat: '3', brand: 'CarSpace', featured: true, stock: 18 },
  { name_ka: 'სავარძლის უკანა ჯიბე', name_en: 'Seat Back Pocket Organizer', price: 20, sale_price: null as number | null, cat: '3', brand: 'CarSpace', featured: false, stock: 50 },
  { name_ka: 'საჭის ტყავის საფარი', name_en: 'Leather Steering Cover', price: 30, sale_price: null as number | null, cat: '4', brand: 'AutoLux', featured: true, stock: 35 },
  { name_ka: 'ორთოპედიული სავარძლის ბალიში', name_en: 'Orthopedic Seat Cushion', price: 40, sale_price: 32 as number | null, cat: '4', brand: 'ComfortDrive', featured: true, stock: 22 },
  { name_ka: 'LED ინტერიერის განათება RGB', name_en: 'RGB Interior LED Strip', price: 35, sale_price: 28 as number | null, cat: '5', brand: 'GlowRide', featured: true, stock: 40 },
  { name_ka: 'სურნელი - ავტომატური', name_en: 'Auto Air Freshener', price: 12, sale_price: null as number | null, cat: '5', brand: 'Yankee', featured: false, stock: 60 },
  { name_ka: 'საგანგებო ჩაქუჩი + საჭრისი', name_en: 'Emergency Hammer + Cutter', price: 15, sale_price: null as number | null, cat: '6', brand: 'SafeEscape', featured: false, stock: 70 },
  { name_ka: 'საბურავის კომპრესორი 12V', name_en: '12V Tire Compressor', price: 65, sale_price: 52 as number | null, cat: '6', brand: 'AirForce', featured: true, stock: 15 },
  { name_ka: 'Jump Starter 12000mAh', name_en: 'Jump Starter 12000mAh', price: 95, sale_price: 79 as number | null, cat: '6', brand: 'NOCO', featured: true, stock: 8 },
  { name_ka: '3-in-1 დამტენის კაბელი', name_en: '3-in-1 Charging Cable', price: 12, sale_price: 9 as number | null, cat: '7', brand: 'Baseus', featured: false, stock: 150 },
  { name_ka: 'LED ფანარი მინი', name_en: 'Mini LED Flashlight', price: 15, sale_price: null as number | null, cat: '7', brand: 'Olight', featured: false, stock: 90 },
  { name_ka: 'მზის ჩამკეტი (წინა)', name_en: 'Windshield Sunshade', price: 22, sale_price: null as number | null, cat: '4', brand: 'SunBlock', featured: false, stock: 55 },
  { name_ka: 'სავარძლის ნაპრალის შემავსებელი', name_en: 'Seat Gap Filler (2pc)', price: 18, sale_price: 14 as number | null, cat: '3', brand: 'DropStop', featured: false, stock: 65 },
];

export const mockProducts: Product[] = productData.map((p, i) => ({
  id: `prod-${i + 1}`,
  sku: `SKU-${1000 + i}`,
  name_ka: p.name_ka,
  name_en: p.name_en,
  description_ka: `${p.name_ka} - მაღალი ხარისხის პროდუქტი`,
  description_en: `${p.name_en} - High quality product`,
  price: p.price,
  sale_price: p.sale_price,
  currency: 'GEL',
  category_id: p.cat,
  brand: p.brand,
  stock_quantity: p.stock,
  is_active: true,
  is_featured: p.featured,
  specifications: {},
  images: [{
    id: `img-${i + 1}`,
    product_id: `prod-${i + 1}`,
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop',
    alt_text: p.name_en,
    sort_order: 0,
    is_primary: true,
  }],
  category: mockCategories.find(c => c.id === p.cat)
    ? { name_ka: mockCategories.find(c => c.id === p.cat)!.name_ka, name_en: mockCategories.find(c => c.id === p.cat)!.name_en }
    : undefined,
  created_at: new Date(Date.now() - i * 86400000).toISOString(),
  updated_at: now,
}));

const names = ['გიორგი კახიძე', 'ნინო ბერიძე', 'დავით ჯანელიძე', 'მარიამ ხვედელიძე', 'ალექსი მამალაძე', 'თამარ გოგოლაძე', 'ირაკლი შენგელია', 'ანა ტაბიძე', 'ლევან ნოზაძე', 'სოფო ქურდაძე'];
const phones = ['+995 555 12 34 56', '+995 577 98 76 54', '+995 599 11 22 33', '+995 551 44 55 66', '+995 568 77 88 99', '+995 555 00 11 22', '+995 577 33 44 55', '+995 599 66 77 88', '+995 551 99 00 11', '+995 568 22 33 44'];
const cities = ['თბილისი', 'ბათუმი', 'ქუთაისი', 'თბილისი', 'რუსთავი', 'თბილისი', 'ზუგდიდი', 'თბილისი', 'გორი', 'ბათუმი'];
const addresses = ['რუსთაველის გამზ. 12', 'ჭავჭავაძის ქ. 45', 'გელათის ქ. 8', 'ვაჟა-ფშაველას გამზ. 71', 'მშვიდობის ქ. 3', 'აბაშიძის ქ. 22', 'ზვიად გამსახურდიას ქ. 15', 'თამარ მეფის გამზ. 6', 'სტალინის ქ. 19', 'გორგილაძის ქ. 30'];

export const mockUsers: UserProfile[] = names.map((name, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  full_name: name,
  phone: phones[i],
  city: cities[i],
  address: addresses[i],
  preferred_language: (i % 3 === 0 ? 'en' : 'ka') as 'ka' | 'en',
  is_admin: i === 0,
  orders_count: Math.floor(Math.random() * 8),
  created_at: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  updated_at: now,
}));

const statuses: Array<'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'> = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const payStatuses: Array<'pending' | 'paid' | 'failed'> = ['pending', 'paid', 'paid'];
const methods: Array<'bog_ipay' | 'tbc_checkout' | 'cash_on_delivery'> = ['bog_ipay', 'tbc_checkout', 'cash_on_delivery'];

export const mockOrders: Order[] = Array.from({ length: 15 }, (_, i) => {
  const items = Array.from({ length: 1 + Math.floor(Math.random() * 3) }, (_, j) => {
    const p = mockProducts[Math.floor(Math.random() * mockProducts.length)];
    const qty = 1 + Math.floor(Math.random() * 3);
    return {
      id: `oi-${i}-${j}`,
      order_id: `order-${i + 1}`,
      product_id: p.id,
      product_name: p.name_ka,
      product_sku: p.sku,
      quantity: qty,
      unit_price: p.sale_price ?? p.price,
      total_price: (p.sale_price ?? p.price) * qty,
    };
  });
  const subtotal = items.reduce((s, it) => s + it.total_price, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const user = mockUsers[i % mockUsers.length];

  return {
    id: `order-${i + 1}`,
    order_number: `MQA-${20260401 + i}-${String.fromCharCode(65 + i)}X${i}Z`,
    user_id: user.id,
    status: statuses[i % statuses.length],
    payment_status: payStatuses[i % payStatuses.length],
    payment_method: methods[i % methods.length],
    payment_transaction_id: null,
    subtotal,
    shipping_cost: shipping,
    total: subtotal + shipping,
    currency: 'GEL',
    customer_name: user.full_name || 'Unknown',
    customer_phone: user.phone || '',
    customer_email: user.email || null,
    delivery_city: i % 2 === 0 ? 'თბილისი' : 'ბათუმი',
    delivery_address: `ჭავჭავაძის გამზირი ${10 + i}`,
    delivery_postal_code: `010${i}`,
    delivery_method: (i % 3 === 0 ? 'express' : 'standard') as 'standard' | 'express',
    notes: null,
    items,
    created_at: new Date(Date.now() - i * 86400000).toISOString(),
    updated_at: now,
  };
});

export const mockStats = {
  total_users: mockUsers.length,
  total_orders: mockOrders.length,
  total_revenue: mockOrders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + o.total, 0),
  total_products: mockProducts.length,
  pending_orders: mockOrders.filter(o => o.status === 'pending').length,
  low_stock_products: mockProducts.filter(p => p.stock_quantity < 10).length,
};
